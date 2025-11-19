import axios from 'axios';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { handleFacebookLogin } from '../services/auth.service';

const { USER_APP_ID, USER_APP_SECRET, USER_FB_CALLBACK_URL } = process.env;

passport.use(
  'facebook-user',
  new FacebookStrategy(
    {
      clientID: USER_APP_ID!,
      clientSecret: USER_APP_SECRET!,
      callbackURL: USER_FB_CALLBACK_URL!,
      profileFields: ['id', 'displayName', 'emails'],
    },

    async (accessToken, _rt, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || '';
        const name = profile.displayName || '';
        const [firstname, ...rest] = name.split(' ');
        const lastname = rest.join(' ');

        /** Exchange short-lived → long-lived token */
        const longTokenRes = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
          params: {
            grant_type: 'fb_exchange_token',
            client_id: USER_APP_ID,
            client_secret: USER_APP_SECRET,
            fb_exchange_token: accessToken,
          },
        });

        const longToken = longTokenRes.data.access_token;

        const payload = {
          firstname,
          lastname,
          email,
          facebookId: profile.id,
          facebookAccessToken: longToken,
          facebookPageId: null,
          instagramBusinessAccountId: null,
        };

        const { user, token } = await handleFacebookLogin(payload);

        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export { default as passportUser } from 'passport';
