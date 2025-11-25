import axios from 'axios';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { handleFacebookLogin } from '../services/auth.service';

const { ADMIN_APP_ID, ADMIN_APP_SECRET, ADMIN_FB_CALLBACK_URL } = process.env;

passport.use(
  'facebook-admin',
  new FacebookStrategy(
    {
      clientID: ADMIN_APP_ID!,
      clientSecret: ADMIN_APP_SECRET!,
      callbackURL: ADMIN_FB_CALLBACK_URL!,
      profileFields: ['id', 'displayName', 'emails'],
    },

    async (accessToken, _rt, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || '';
        const name = profile.displayName || '';
        const [firstname, ...rest] = name.split(' ');
        const lastname = rest.join(' ');

        //  Exchange short-lived → long-lived token
        const longTokenRes = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
          params: {
            grant_type: 'fb_exchange_token',
            client_id: ADMIN_APP_ID,
            client_secret: ADMIN_APP_SECRET,
            fb_exchange_token: accessToken,
          },
        });

        const longToken = longTokenRes.data.access_token;

        // Debug token to get granular scopes
        const debugRes = await axios.get('https://graph.facebook.com/v18.0/debug_token', {
          params: {
            input_token: longToken,
            access_token: `${ADMIN_APP_ID}|${ADMIN_APP_SECRET}`,
          },
        });

        // console.log('Token Debug:', JSON.stringify(debugRes.data, null, 2));

        // Extract Page ID and Instagram ID from granular_scopes
        const granularScopes = debugRes.data.data.granular_scopes || [];

        let facebookPageId: string | null = null;
        let instagramBusinessAccountId: string | null = null;

        // Find Page ID from pages_show_list scope
        const pageScope = granularScopes.find((s: any) => s.scope === 'pages_show_list');
        if (pageScope && pageScope.target_ids?.length > 0) {
          facebookPageId = pageScope.target_ids[0];
        }

        // Find Instagram ID from instagram_basic scope
        const instaScope = granularScopes.find((s: any) => s.scope === 'instagram_basic');
        if (instaScope && instaScope.target_ids?.length > 0) {
          instagramBusinessAccountId = instaScope.target_ids[0];
        }

        // console.log(' Facebook Page ID from token:', facebookPageId);
        // console.log(' Instagram Business Account ID from token:', instagramBusinessAccountId);

        // Get Page Access Token (if we have a page ID)
        let pageAccessToken: string | null = null;

        if (facebookPageId) {
          try {
            const pageTokenRes = await axios.get(`https://graph.facebook.com/v18.0/${facebookPageId}`, {
              params: {
                fields: 'access_token',
                access_token: longToken,
              },
            });
            pageAccessToken = pageTokenRes.data.access_token || null;
            // console.log(' Page Access Token:', pageAccessToken ? 'Retrieved' : 'Not found');
          } catch (err) {
            // console.error('Failed to get page access token:', err);
            // Fall back to user token
            pageAccessToken = longToken;
          }
        }

        //  Final payload
        const payload = {
          firstname,
          lastname,
          email,
          facebookId: profile.id,
          facebookAccessToken: pageAccessToken || longToken,
          facebookPageId,
          instagramBusinessAccountId,
        };

        // console.log(' FINAL PAYLOAD:', JSON.stringify(payload, null, 2));

        // Save / login user
        const { user, token } = await handleFacebookLogin(payload);

        return done(null, { user, token });
      } catch (err) {
        console.error('FB ADMIN LOGIN ERROR:', err);
        if (axios.isAxiosError(err)) {
          console.error('Response:', err.response?.data);
        }
        return done(err, null);
      }
    }
  )
);

export { default as passportAdmin } from 'passport';
