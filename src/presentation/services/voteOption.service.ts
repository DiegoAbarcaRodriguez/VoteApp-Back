import { VoteOptionModel } from "../../data";
import { CreateVoteDto } from "../../domain/dtos/create-vote.dto";
import { UpdateVoteDto } from "../../domain/dtos/update-vote.dto";
import { VoteOptionEntity } from "../../domain/entities/vote-option.entity";
import { CustomError } from "../../domain/errors/custom.error";
import { WssService } from "./wss.service";

export class VoteOptionService {

    constructor(private wssService: WssService) { }

    async getVotes(): Promise<VoteOptionEntity[]> {
        try {
            const votes = await VoteOptionModel.find();
            return votes.map(VoteOptionEntity.fromObject);


        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async createVote(createVoteDto: CreateVoteDto): Promise<boolean> {
        try {

            const vote = await VoteOptionModel.create(createVoteDto);
            const voteEntity = VoteOptionEntity.fromObject(vote);
            this.wssService.sendMessage('create-option-vote', voteEntity);
            return true;


        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateVote(updateVoteDto: UpdateVoteDto): Promise<boolean> {

        const { _id } = updateVoteDto;

        try {

            const existingVote = await VoteOptionModel.findById(_id);
            if (!existingVote) throw CustomError.notFound('Option to vote not found');

            const vote = await VoteOptionModel.findByIdAndUpdate(_id, updateVoteDto.values, { new: true });
            const voteEntity = VoteOptionEntity.fromObject(vote!);
            this.wssService.sendMessage('update-option-vote', voteEntity);
            return true;


        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteVote(_id: string): Promise<boolean> {


        try {

            const existingVote = await VoteOptionModel.findById(_id);
            if (!existingVote) throw CustomError.notFound('Option to vote not found');

            const vote = await VoteOptionModel.findByIdAndDelete(_id);
            const voteEntity = VoteOptionEntity.fromObject(vote!);
            this.wssService.sendMessage('delete-option-vote', voteEntity);
            return true;


        } catch (error) {
            console.error(error);
            throw error;
        }
    }


}