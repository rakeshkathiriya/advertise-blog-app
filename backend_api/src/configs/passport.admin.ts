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

        /** Exchange short → long token */
        const longTokenRes = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
          params: {
            grant_type: 'fb_exchange_token',
            client_id: ADMIN_APP_ID,
            client_secret: ADMIN_APP_SECRET,
            fb_exchange_token: accessToken,
          },
        });

        const longToken = longTokenRes.data.access_token;

        /** Fetch Pages */
        const pagesRes = await axios.get('https://graph.facebook.com/v18.0/me/accounts', {
          params: { access_token: longToken, fields: 'id,name,access_token' },
        });

        let facebookPageId = null;
        let instagramBusinessAccountId = null;

        if (pagesRes.data.data?.length > 0) {
          facebookPageId = pagesRes.data.data[0].id;
          const pageToken = pagesRes.data.data[0].access_token;

          const igRes = await axios.get(`https://graph.facebook.com/v18.0/${facebookPageId}`, {
            params: {
              fields: 'instagram_business_account',
              access_token: pageToken,
            },
          });

          instagramBusinessAccountId = igRes.data.instagram_business_account?.id || null;
        }

        const payload = {
          firstname,
          lastname,
          email,
          facebookId: profile.id,
          facebookAccessToken: longToken,
          facebookPageId,
          instagramBusinessAccountId,
        };

        const { user, token } = await handleFacebookLogin(payload);

        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export { default as passportAdmin } from 'passport';
