import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.error";
import { PollService } from "../services/poll.service";
import { CreatePollDto } from "../../domain/dtos/create-poll.dto";
import { MongooseAdapter } from "../../config";
import { PaginationDto } from "../../domain/dtos/pagination.dto";
import { UpdatePollDto } from "../../domain/dtos/update-poll.dto";

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

    updatePoll = (req: Request, res: Response) => {
        const { user } = req.body;
        const { _id } = req.params;

        if (!_id || !MongooseAdapter.isValidId(_id)) {
            res.status(400).json({ message: 'The _id is not valid!' })
        }

        const [error, updatePollDto] = UpdatePollDto.create({ ...req.body });

        if (error) {
            res.status(400).json({ message: error });
        }

        this.pollService.updatePoll(updatePollDto!, _id, user._id)
            .then((resp) => res.json(resp))
            .catch(error => this.handleError(error, res));
    }

    plusOneNumberParticipations = (req: Request, res: Response) => {
        const { _id } = req.params;

        if (!_id || !MongooseAdapter.isValidId(_id)) {
            res.status(400).json({ message: 'The _id is not valid!' })
        }

        this.pollService.plusOneNumberParticipations(_id)
            .then((resp) => res.json(resp))
            .catch(error => this.handleError(error, res));
    }

    deletePoll = (req: Request, res: Response) => {
        const { user } = req.body;
        const { _id } = req.params;

        if (!_id || !MongooseAdapter.isValidId(_id)) {
            res.status(400).json({ message: 'The _id is not valid!' })
        }

        this.pollService.deletePoll(_id, user._id)
            .then((resp) => res.json(resp))
            .catch(error => this.handleError(error, res));
    }
}