import { AuthPayload } from '../../middlewares/authMiddleware';

declare global {
  namespace Express {
    interface User extends AuthPayload {}
  }
}
