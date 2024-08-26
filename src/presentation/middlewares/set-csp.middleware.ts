import { NextFunction, Request, Response } from "express";

export class CSPMiddleware {
    static setCSP(req: Request, res: Response, next: NextFunction) {
        res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'");
        next();
    }
}