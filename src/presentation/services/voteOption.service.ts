import { VoteOptionModel } from "../../data";
import { pollModel } from "../../data/models/poll.model";
import { CreateVoteDto } from "../../domain/dtos/create-vote.dto";
import { UpdateVoteDto } from "../../domain/dtos/update-vote.dto";
import { VoteOptionEntity } from "../../domain/entities/vote-option.entity";
import { CustomError } from "../../domain/errors/custom.error";
import { WssService } from "./wss.service";
import { PollEntity } from '../../domain/entities/poll.entity';
import { userModel } from "../../data/models/user.model";

export class VoteOptionService {

    constructor(private wssService: WssService) { }

    async getVotes(poll_id: string, user_id: string): Promise<VoteOptionEntity[]> {
        try {

            const existingPoll = await pollModel.findById(poll_id);

            if (!existingPoll) {
                throw CustomError.notFound('Poll not found!');
            }


            if (JSON.stringify(existingPoll.user_id) !== JSON.stringify(user_id)) {
                throw CustomError.forbidden('This poll does not belong to you!');
            }

            const votes = await VoteOptionModel.find({ poll_id });
            return votes.map(VoteOptionEntity.fromObject);


        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getVotesByAccessCode(poll_id: string): Promise<VoteOptionEntity[]> {
        try {

            const existingPoll = await pollModel.findById(poll_id);

            if (!existingPoll) {
                throw CustomError.notFound('Poll not found!');
            }

            if (existingPoll.numberOfParticipants === existingPoll.numberOfParticipations) {
                throw CustomError.badRequest('THe poll has already ended!');
            }

            const votes = await VoteOptionModel.find({ poll_id });
            return votes.map(VoteOptionEntity.fromObject);


        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async createVote(createVoteDto: CreateVoteDto, user_id: string, email: string): Promise<boolean> {
        try {
            const existingPoll = await pollModel.findById(createVoteDto.poll_id);
            if (!existingPoll) {
                throw CustomError.notFound('poll not found!');
            }

            if (JSON.stringify(existingPoll.user_id) !== JSON.stringify(user_id)) {
                throw CustomError.forbidden('This poll does not belong to you!');
            }

            const vote = await VoteOptionModel.create(createVoteDto);
            const voteEntity = VoteOptionEntity.fromObject(vote);
            this.wssService.sendMessage('create-option-vote', voteEntity, email, voteEntity.poll_id);
            return true;


        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateVote(updateVoteDto: UpdateVoteDto, email: string): Promise<boolean> {

        const { _id } = updateVoteDto;

        try {

            const existingVote = await VoteOptionModel.findById(_id);
            if (!existingVote) throw CustomError.notFound('Option to vote not found');

            const vote = await VoteOptionModel.findByIdAndUpdate(_id, updateVoteDto.values, { new: true });
            const voteEntity = VoteOptionEntity.fromObject(vote!);
            this.wssService.sendMessage('update-option-vote', voteEntity, email, voteEntity.poll_id);
            return true;


        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async incrementAmountVotes(updateVoteDto: UpdateVoteDto): Promise<{ ok: boolean, voteEntity: VoteOptionEntity }> {

        const { _id } = updateVoteDto;

        try {

            const existingVote = await VoteOptionModel.findById(_id);
            if (!existingVote) throw CustomError.notFound('Option to vote not found');

            const voteOptionUpdated = await VoteOptionModel.findByIdAndUpdate(_id, updateVoteDto.values, { new: true });
            const voteEntity = VoteOptionEntity.fromObject(voteOptionUpdated || {});

            const poll = await pollModel.findById(voteEntity.poll_id);
            const pollEntity = PollEntity.fromObject(poll || {});
            const user = await userModel.findById(pollEntity.user_id);

            this.wssService.sendMessage('update-amount-votes', voteEntity, user?.email!, pollEntity._id);

            return {
                ok: true,
                voteEntity
            };


        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteVote(_id: string, email: string): Promise<boolean> {


        try {

            const existingVote = await VoteOptionModel.findById(_id);
            if (!existingVote) throw CustomError.notFound('Option to vote not found');

            const vote = await VoteOptionModel.findByIdAndDelete(_id);
            const voteEntity = VoteOptionEntity.fromObject(vote!);
            this.wssService.sendMessage('delete-option-vote', voteEntity, email, voteEntity.poll_id);
            return true;


        } catch (error) {
            console.error(error);
            throw error;
        }
    }


}