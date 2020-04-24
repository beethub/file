import {  Request, Response, NextFunction } from "express";
import { v4 } from "uuid";

class Files {

  static formatter = new Intl.DateTimeFormat("es-mx", {
    month: "numeric", 
    year: "numeric"
  })

  static tenant = (req: Request, res: Response, next : NextFunction) => {
    req.tenant = req.params.account;
    next();
  }

  static generateKeyFIle = (req: Request, res: Response, next : NextFunction) => {
    req.fileKey = `${new Date().toISOString().slice(0,7)}/${v4()}`
    next();
  }

  static getKeyFile = (req: Request, res: Response, next : NextFunction) => {
    req.fileKey = req.query.key.toString();
  
    next();
  }

}

export default Files;