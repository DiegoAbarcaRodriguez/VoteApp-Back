import { NextFunction, Request, Response } from "express";
import { userModel } from "../../data/models/user.model";

export class XTokenMiddleware {
    static validateToken = async (req: Request, res: Response, next: NextFunction) => {
        const token = req.header('x-token');
      

        if (!token || token.length < 36) {
            res.status(401).json({ error: 'Token not valid' });
        }

        try {
            const user = await userModel.findOne({ token });
            if (!user) {
                res.status(401).json({ error: 'Invalid x-token - user' })
            }
            req.body.user = user;
            next();

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }


    }
}