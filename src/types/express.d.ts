/* eslint-disable no-unused-vars */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

export {};
