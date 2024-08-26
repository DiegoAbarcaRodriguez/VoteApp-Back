import express, { Router } from 'express';
import rateLimit from 'express-rate-limit';
import path from 'path';
import cors from 'cors';
import expressfileUpload from 'express-fileupload';


export class Server {
    public readonly app = express();
    private serverListener?: any;
    private readonly publicPath: string;


    constructor(public_path: string = 'public') {
        this.publicPath = public_path;
        this.configure();
    }

    private configure() {

        this.app.use(rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
            standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
            legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
            // store: ... , // Redis, Memcached, etc. See below.
        }));

        this.app.use(cors());

        //* Middlewares
        this.app.use(expressfileUpload());
        this.app.use(express.json()); // raw
        this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded
        //* Public Folder
        this.app.use(express.static(this.publicPath));


    }

    setRouter(router: Router) {
        this.app.use(router);
    }

    setRouterToRedirectPublicPath() {
        //* SPA /^\/(?!api).*/  <== Únicamente si no empieza con la palabra api
        this.app.get('*', (req, res) => {
            const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
            res.sendFile(indexPath);
        });
    }

    public close() {
        this.serverListener?.close();
    }


}