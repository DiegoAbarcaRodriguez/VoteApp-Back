import { VoteOptionService } from './../services/voteOption.service';
import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.error";
import { CreateVoteDto } from '../../domain/dtos/create-vote.dto';
import { UpdateVoteDto } from '../../domain/dtos/update-vote.dto';


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
        this.VoteOptionService.getVotes()
            .then(votes => res.json(votes))
            .catch(error => this.handleError(error, res));
    }

    createVoteOption = (req: Request, res: Response) => {
        const [error, createVoteDto] = CreateVoteDto.create(req.body);

        if (error) return res.status(400).json({ message: error });

        this.VoteOptionService.createVote(createVoteDto!)
            .then(resp => res.status(201).json({ ok: resp }))
            .catch(error => this.handleError(error, res));

    }

    updateVoteOption = (req: Request, res: Response) => {
        const { _id } = req.params;

        const [error, updateVoteDto] = UpdateVoteDto.create({ ...req.body, _id });
        if (error) return res.status(400).json({ message: error });

        this.VoteOptionService.updateVote(updateVoteDto!)
            .then(resp => res.json({ ok: resp }))
            .catch(error => this.handleError(error, res));

    }

    deleteVoteOption = (req: Request, res: Response) => {
        const { _id } = req.params;

        this.VoteOptionService.deleteVote(_id)
            .then(resp => res.json({ ok: resp }))
            .catch(error => this.handleError(error, res));
    }


}