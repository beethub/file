declare namespace Express {
  export interface Request {
     tenant?: string,
     fileKey?: string
  }
}