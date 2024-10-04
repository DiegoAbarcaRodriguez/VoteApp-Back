import { VoteOptionService } from './../services/voteOption.service';
import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.error";
import { CreateVoteDto } from '../../domain/dtos/create-vote.dto';
import { UpdateVoteDto } from '../../domain/dtos/update-vote.dto';
import { MongooseAdapter } from '../../config';


export class OptionVoteController {
    constructor(private VoteOptionService: VoteOptionService) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.log(`${error}`);
        return res.status(500).json('Internal Server Error');

    };


    getVoteOptions = (req: Request, res: Response) => {
        const { user } = req.body;
        const { poll_id } = req.params;

        if (!poll_id || !MongooseAdapter.isValidId(poll_id)) {
            res.status(400).json({ message: 'poll_id not valid' });
        }

        this.VoteOptionService.getVotes(poll_id, user._id)
            .then(votes => res.json(votes))
            .catch(error => this.handleError(error, res));
    }

    getVoteOptionsByAccessCode = (req: Request, res: Response) => {
        const { poll_id } = req.params;

        if (!poll_id || !MongooseAdapter.isValidId(poll_id)) {
            res.status(400).json({ error: 'poll_id not valid!' });
        }

        this.VoteOptionService.getVotesByAccessCode(poll_id)
            .then(votes => res.json(votes))
            .catch(error => this.handleError(error, res));
    }

    createVoteOption = (req: Request, res: Response) => {
        const { user } = req.body;
        const [error, createVoteDto] = CreateVoteDto.create(req.body);

        if (error) return res.status(400).json({ message: error });

        this.VoteOptionService.createVote(createVoteDto!, user._id, user.email)
            .then(resp => res.status(201).json({ ok: resp }))
            .catch(error => this.handleError(error, res));

    }

    updateVoteOption = (req: Request, res: Response) => {
        const { _id } = req.params;
        const { user } = req.body;

        const [error, updateVoteDto] = UpdateVoteDto.create({ ...req.body, _id });
        if (error) return res.status(400).json({ message: error });

        this.VoteOptionService.updateVote(updateVoteDto!, user.email)
            .then(resp => res.json({ ok: resp }))
            .catch(error => this.handleError(error, res));

    }

    incrementAmountVoteOption = (req: Request, res: Response) => {
        const { _id } = req.params;

        const [error, updateVoteDto] = UpdateVoteDto.create({ ...req.body, _id });
        if (error) return res.status(400).json({ message: error });

        this.VoteOptionService.incrementAmountVotes(updateVoteDto!)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(error, res));

    }

    deleteVoteOption = (req: Request, res: Response) => {
        const { _id } = req.params;
        const { user } = req.body;

        this.VoteOptionService.deleteVote(_id, user.email)
            .then(resp => res.json({ ok: resp }))
            .catch(error => this.handleError(error, res));
    }


}