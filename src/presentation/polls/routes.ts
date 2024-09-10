import { Router } from "express";
import { PollController } from "./controller";
import { PollService } from "../services/poll.service";
import { JWTMiddleware } from "../middlewares/jwt.middleware";

export class PollRoutes {
    constructor() { }

    static get routes(): Router {

        const pollService: PollService = new PollService();
        const controller = new PollController(pollService);

        const router = Router();

        router.use(JWTMiddleware.validateJWT);
        router.get('/', controller.getPolls);
        router.post('/', controller.createPoll);
        router.put('/:_id', controller.updatePoll);
        router.delete('/:_id', controller.deletePoll);

        return router;
    }
}