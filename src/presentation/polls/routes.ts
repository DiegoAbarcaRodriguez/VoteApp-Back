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

        router.get('/', JWTMiddleware.validateJWT, controller.getPolls);
        router.post('/', JWTMiddleware.validateJWT, controller.createPoll);
        router.put('/:_id', JWTMiddleware.validateJWT, controller.updatePoll);
        router.delete('/:_id', JWTMiddleware.validateJWT, controller.deletePoll);

        router.patch('/:_id', controller.plusOneNumberParticipations);

        return router;
    }
}