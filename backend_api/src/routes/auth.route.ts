import { Router } from 'express';
import { passportAdmin } from '../configs/passport.admin';
import { passportUser } from '../configs/passport.user';
import {
  changePasswordController,
  facebookAdminCallback,
  facebookCallback,
  forgotPasswordController,
  login,
  logout,
  register,
  updatePasswordController,
} from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import validate from '../middlewares/validate.middleware';
import { userSignupSchema } from '../schemaValidation/userValidation';
// import pass
const router = Router();

router.route('/register').post(validate(userSignupSchema), register);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.post('/changePassword', authMiddleware, changePasswordController);
router.post('/resetPassword', forgotPasswordController);
router.post('/updatePassword', updatePasswordController);

// Facebook Login Routes
router.get(
  '/facebook',
  passportUser.authenticate('facebook-user', {
    scope: ['email'],
    failureRedirect: process.env.FRONTEND_URL,
  })
);

router.get(
  '/facebook/callback',
  passportUser.authenticate('facebook-user', {
    session: false,
    failureRedirect: process.env.FRONTEND_URL,
  }),
  facebookCallback
);

// Admin login (Business App)
router.get(
  '/facebook/admin',
  passportAdmin.authenticate('facebook-admin', {
    scope: [
      'email',
      'public_profile',
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_posts',
      'instagram_basic',
      'instagram_content_publish',
    ],
    auth_type: 'rerequest',
    failureRedirect: process.env.FRONTEND_URL,
  } as any)
);

router.get(
  '/facebook/admin/callback',
  passportAdmin.authenticate('facebook-admin', {
    session: false,
    failureRedirect: process.env.FRONTEND_URL,
  }),
  facebookAdminCallback
);

export default router;
