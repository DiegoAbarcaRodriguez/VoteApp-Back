import { participantModel } from "../../data/models/participant.model";
import { pollParticipantModel } from "../../data/models/poll-participants.model";
import { CustomError } from "../../domain/errors/custom.error";

export class ParticipantService {

    executeParticipation = async (name: string, poll_id: string) => {
        try {

            const existingParticipant = await participantModel.findOne({ name });
            let participant_id: string = '';

            if (!existingParticipant) {
                participant_id = (await participantModel.create({ name }))._id.toString();
            } else {

                participant_id = existingParticipant!._id.toString();

                const existingPollParticipant = await pollParticipantModel.findOne({ participant_id, poll_id });

                if (existingPollParticipant) {
                    throw CustomError.forbidden('This user has already voted!');
                }
            }


            await pollParticipantModel.create({ participant_id, poll_id });

            return {
                ok: true,
                message: 'It has been registered your participation correctly!'
            }

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    verifyParticipant = async (name: string, poll_id: string) => {
        try {
            const existingParticipant = await participantModel.findOne({ name });

            if (existingParticipant) {
                const existingPollParticipant = await pollParticipantModel.findOne({ participant_id: existingParticipant._id, poll_id });

                if (existingPollParticipant) {
                    throw CustomError.forbidden('This user has already voted!');
                }
            }


            return {
                ok: true,
                poll_id
            }


        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}