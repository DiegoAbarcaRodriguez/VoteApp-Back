import { Router } from "express";
import { ParticipantController } from "./controller";
import { ParticipantService } from "../services/participant.service";

export class ParticipantRoutes {
    static get routes(): Router {
        const router = Router();
        const participantService = new ParticipantService();
        const controller = new ParticipantController(participantService);

        router.get('/:poll_id/:participant_id', controller.executeParticipation);
        router.post('/', controller.verifyParticipant);

        return router;
    }
}