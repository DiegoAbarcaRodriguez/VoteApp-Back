import { Request, Response } from 'express';
import { ParticipantService } from "../services/participant.service"
import { MongooseAdapter } from '../../config';
import { CustomError } from '../../domain/errors/custom.error';

export class ParticipantController {
    constructor(private participantService: ParticipantService) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.log(`${error}`);
        return res.status(500).json('Internal Server Error');

    };

    executeParticipation = (req: Request, res: Response) => {
        const { poll_id, name } = req.params;

        if (!MongooseAdapter.isValidId(poll_id)) {
            res.status(400).json({ message: 'The poll_id is not valid!' });
        }

        if (!name || name.length === 0) {
            res.status(400).json({ message: 'The  name of the participant is missing!' });
        }

        this.participantService.executeParticipation(name, poll_id)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(error, res));
    }


    verifyParticipant = (req: Request, res: Response) => {
        const { name, poll_id } = req.body;

        if (!MongooseAdapter.isValidId(poll_id)) {
            res.status(400).json({ message: 'The poll_id is not valid!' });
        }

        if (!name) {
            res.status(400).json({ message: 'The name is missing!' });
        }

        this.participantService.verifyParticipant(name, poll_id)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(error, res));

    }
}