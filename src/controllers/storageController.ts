import express, { Request, Response } from "express";
import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import { Controller } from "./controller";
import Files from "../middlewares/files";

class StorageController implements Controller {
  public _path: string = "/";
  private _router = express.Router();
  private _s3: aws.S3;
  private _bucket: string;

  constructor(
    spaceKey: string,
    spaceSecret: string,
    bucket: string,
    env: string
  ) {
    this._s3 = new aws.S3({
      endpoint: "https://nyc3.digitaloceanspaces.com",
      accessKeyId: spaceKey,
      secretAccessKey: spaceSecret,
    });
    this._bucket = bucket;
    this._initializeRoutes(env);
  }

  get path() {
    return this._path;
  }
  get router() {
    return this._router;
  }

  private _initializeRoutes(env: string) {
    this._router.post("/ticket/:account", Files.tenant, Files.generateKeyFIle, this.uploadImage(env), (req : Request, res: Response) => {
      res.status(200).json({ url: `${req.fileKey}/${req.file.originalname}` });
    });
    this._router.get("/ticket/:account", Files.tenant, Files.getKeyFile, this._downloadFile(env));
  }

  private _imageFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: any
  ) => {
    const validType: boolean = !!file.mimetype.match(/image\/\w{3,4}$/);
    const validExtension: boolean = !!file.originalname.match(
      /\.(jpg|jpeg|png|gif)$/
    );

    if (validType && validExtension) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Only image files are allowed! ${file.mimetype}| ${file.originalname}`
        ),
        false
      );
    }
  };

  private _uploadHandler = (env: string) => (
    req: Express.Request,
    file: Express.Multer.File,
    cb: any
  ) => {
    //console.log((req as any).params);
    
    console.log(file);
    console.log(`${env}/${req.tenant}/${req.fileKey}/${file.originalname}`);
  
    //env/account/YYYY-MM/UUID/originalname
    cb(null, `${env}/${req.tenant}/${req.fileKey}/${file.originalname}`);
  };

  public uploadImage = (env: string) =>
    multer({
      storage: multerS3({
        s3: this._s3,
        bucket: this._bucket,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: this._uploadHandler(env),
      }),
      fileFilter: this._imageFilter,
    }).single("file");

  private _downloadFile= (env: string) => (req: Request, res: Response) => {
    const key = `${env}/${req.tenant}/${req.fileKey}`;

    console.log(key);
    
    res.attachment(req.fileKey);
    const fileStream = this._s3.getObject({
      Bucket: this._bucket,
      Key: key
    }).createReadStream();
    fileStream.pipe(res);
  }
    
}

export default StorageController;
