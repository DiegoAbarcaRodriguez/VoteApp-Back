import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { userModel } from "../../data/models/user.model";

export class JWTMiddleware {
    static async validateJWT(req: Request, res: Response, next: NextFunction) {
        const authorization = req.header('Authorization');

        if (!authorization) return res.status(401).json({ error: 'No token provided' });
        if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Invalid bearer token' });

        const token = authorization.split(' ').at(1) || '';

        try {
            const payload = await JwtAdapter.validateToken<{ _id: string }>(token);
            if (!payload) return res.status(401).json({ error: 'Invalid token' });

            const user = await userModel.findById(payload._id);
            if (!user) return res.status(401).json({ error: 'Invalid token - user' });

            req.body.user = user;
            next();


        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }


    }
}