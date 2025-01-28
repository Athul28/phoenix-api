// src/types/express.d.ts
import { User } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: User; 
    }
  }
}
