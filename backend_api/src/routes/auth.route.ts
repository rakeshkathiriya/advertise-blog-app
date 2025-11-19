import { Router } from 'express';
import { passportAdmin } from '../configs/passport.admin';
import { passportUser } from '../configs/passport.user';
import { facebookAdminCallback, facebookCallback, login, logout, register } from '../controllers/auth.controller';
import validate from '../middlewares/validate.middleware';
import { userSignupSchema } from '../schemaValidation/userValidation';
// import pass
const router = Router();

router.route('/register').post(validate(userSignupSchema), register);
router.route('/login').post(login);
router.route('/logout').post(logout);

// Facebook Login Routes
router.get(
  '/facebook',
  passportUser.authenticate('facebook-user', {
    scope: ['email'],
  })
);

router.get('/facebook/callback', passportUser.authenticate('facebook-user', { session: false }), facebookCallback);

// Admin login (Business App)
router.get(
  '/facebook/admin',
  passportAdmin.authenticate('facebook-admin', {
    scope: ['email', 'pages_show_list', 'pages_manage_posts', 'instagram_basic', 'instagram_content_publish'],
    auth_type: 'rerequest',
  } as any)
);

router.get(
  '/facebook/admin/callback',
  passportAdmin.authenticate('facebook-admin', { session: false }),
  facebookAdminCallback
);
export default router;
