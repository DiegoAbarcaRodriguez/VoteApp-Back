import { Router } from "express";
import { OptionVoteController } from "./controller";
import { VoteOptionService } from "../services/voteOption.service";
import { WssService } from "../services/wss.service";

export class OptionVoteRoutes {
    static get routes(): Router {
        const router = Router();
        const voteService = new VoteOptionService(WssService.instance);
        const controller = new OptionVoteController(voteService);

        router.get('/', controller.getVoteOptions);
        router.post('/', controller.createVoteOption);
        router.put('/:_id', controller.updateVoteOption);
        router.delete('/:_id', controller.deleteVoteOption);

        return router;

    }
}