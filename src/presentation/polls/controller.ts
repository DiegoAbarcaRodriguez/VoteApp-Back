import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.error";
import { PollService } from "../services/poll.service";
import { CreatePollDto } from "../../domain/dtos/create-poll.dto";
import { MongooseAdapter } from "../../config";
import { PaginationDto } from "../../domain/dtos/pagination.dto";

export class PollController {
    constructor(private pollService: PollService) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.log(`${error}`);
        return res.status(500).json('Internal Server Error');

    };

    createPoll = (req: Request, res: Response) => {

        const { user } = req.body;
        const [error, createPollDto] = CreatePollDto.create({ ...req.body, user_id: user._id });

        if (error) {
            res.status(400).json({ message: error });
        }

        this.pollService.createPoll(createPollDto!)
            .then(() => res.status(201).json({ ok: true, message: 'The poll has been created succesfully!' }))
            .catch(error => this.handleError(error, res));

    }

    getPolls = (req: Request, res: Response) => {
        const { user } = req.body;
        const { page = 0, limit = 0 } = req.query;

        if (!MongooseAdapter.isValidId(user._id)) {
            res.status(400).json({ message: 'user_id not valid' });
        }

        const [error, paginationDto] = PaginationDto.create({ page: +page, limit: +limit });

        if (error) {
            res.status(400).json({ message: error });
        }

        this.pollService.getPolls(user._id, paginationDto!)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(error, res));
    }
}