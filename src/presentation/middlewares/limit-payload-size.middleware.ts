import { NextFunction, Request, Response } from "express";

export class LimitPayloadSizeMiddleware {


    static limitPayloadSize = (req: Request, res: Response, next: NextFunction) => {
        const MAX_PAYLOAD_SIZE = 10024 * 10024; // 1MB
        if (req.headers['content-length'] && parseInt(req.headers['content-length']) > MAX_PAYLOAD_SIZE) {
            return res.status(413).json({ error: 'Payload size exceeds the limit' });
        }
        next();
    }
}