import { Router } from "express";
import { OptionVoteController } from "./controller";
import { VoteOptionService } from "../services/voteOption.service";
import { WssService } from "../services/wss.service";
import { JWTMiddleware } from "../middlewares/jwt.middleware";

export class OptionVoteRoutes {
    static get routes(): Router {
        const router = Router();
        const voteService = new VoteOptionService(WssService.instance);
        const controller = new OptionVoteController(voteService);

        router.get('/:poll_id', JWTMiddleware.validateJWT, controller.getVoteOptions);
        router.get('/byAccessCode/:poll_id', controller.getVoteOptionsByAccessCode);
        router.patch('/incrementVotes/:_id', controller.incrementAmountVoteOption);
        router.post('/', JWTMiddleware.validateJWT, controller.createVoteOption);
        router.patch('/:_id', JWTMiddleware.validateJWT, controller.updateVoteOption);
        router.delete('/:_id', JWTMiddleware.validateJWT, controller.deleteVoteOption);

        return router;

    }
}