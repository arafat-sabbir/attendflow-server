
import { JwtPayload } from 'jsonwebtoken';
// Custom Type to add User on the Request of Express
declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}
