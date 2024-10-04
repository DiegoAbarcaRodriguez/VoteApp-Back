import { Router } from "express";
import { UserController } from "./controller";
import { UserService } from "../services/user.service";
import { EmailService } from "../services/email.service";
import { JWTMiddleware } from "../middlewares/jwt.middleware";
import { XTokenMiddleware } from "../middlewares/x-token.middleware";
import { WssService } from "../services/wss.service";

export class UserRoutes {

    static get routes(): Router {

        const emailService = new EmailService();
        const userService = new UserService(emailService, WssService.instance);
        const controller = new UserController(userService);

        const router = Router();

        router.post('/login', controller.signIn);
        router.post('/sign-up', controller.signUp);
        router.post('/google', controller.google);
        router.post('/check-jwt', JWTMiddleware.validateJWT, controller.checkJWT);
        router.post('/validate-xtoken', XTokenMiddleware.validateToken, controller.checkXToken);
        router.post('/recover-password', controller.recoverPassword);
        router.put('/update-password', controller.updatePassword);
        router.put('/close-user-session', controller.closeUserSession);


        return router;
    }
}