import { pollModel } from "../../data/models/poll.model";
import { CreatePollDto } from "../../domain/dtos/create-poll.dto";
import { PaginationDto } from "../../domain/dtos/pagination.dto";
import { UpdatePollDto } from "../../domain/dtos/update-poll.dto";
import { CustomError } from "../../domain/errors/custom.error";
import { PollEntity } from '../../domain/entities/poll.entity';

export class PollService {
    constructor() { }

    createPoll = async (createPollDto: CreatePollDto) => {
        try {
            const poll = await pollModel.findOne({ title: createPollDto.title, user_id: createPollDto.user_id });
            if (poll) {
                throw CustomError.badRequest('There is a poll with tha name in existence!');
            }

            await pollModel.create(createPollDto);
            return true;

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    updatePoll = async (updatePollDto: UpdatePollDto, _id: string) => {
        try {
            const existingPoll = await pollModel.findById(_id);
            if (!existingPoll) {
                throw CustomError.notFound('Poll not found!');
            }

            const poll = await pollModel.findByIdAndUpdate(_id, updatePollDto.value, { new: true });
            const newPoll = poll as any;
            return { ok: true, poll: newPoll?._doc };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    deletePoll = async (_id: string) => {
        try {
            const existingPoll = await pollModel.findById(_id);
            if (!existingPoll) {
                throw CustomError.notFound('Poll not found!');
            }

            const eliminatedPoll = await pollModel.findByIdAndDelete(_id, { new: true });
            const newPoll = eliminatedPoll as any;
            return { ok: true, poll: newPoll?._doc };

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    getPolls = async (user_id: string, paginationDto: PaginationDto) => {
        const { page, limit } = paginationDto;
        try {
            const [polls, total] = await Promise.all([
                pollModel.find({ user_id })
                    .skip((page - 1) * limit)
                    .limit(limit),
                pollModel.countDocuments()
            ]);

            let pagesNumber: number[] = [];
            for (let i = 0; i < Math.ceil(total / limit); i++) {
                pagesNumber.push(i);
            }

            const pollsEntity = polls.map(PollEntity.fromObject);

            return {
                pagesNumber,
                total,
                polls: pollsEntity,
                page,
                next: (page < Math.ceil(total / limit)) ? `/api/poll?page=${page + 1}&limit=${limit}` : '',
                previous: (page > 1) ? `/api/poll?page=${page + -1}&limit=${limit}` : '',
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}