import { Router } from "express";
import { OptionVoteRoutes } from "./optionVote/routes";
import { LimitPayloadSizeMiddleware } from "./middlewares/limit-payload-size.middleware";
import { CSPMiddleware } from "./middlewares/set-csp.middleware";
import { UserRoutes } from "./users/routes";
import { PollRoutes } from "./polls/routes";
import { ParticipantRoutes } from "./participant/routes";

export class AppRoutes {
    static get routes(): Router {

        const router = Router();

        router.use([LimitPayloadSizeMiddleware.limitPayloadSize, CSPMiddleware.setCSP]);
        router.use('/api/optionVote', OptionVoteRoutes.routes);
        router.use('/api/user', UserRoutes.routes);
        router.use('/api/poll', PollRoutes.routes);
        router.use('/api/participant', ParticipantRoutes.routes);

        return router;

    }
}