import { MongooseAdapter } from "../../config";


export class CreatePollDto {

    constructor(
        public title: string,
        private description: string,
        private numberOfParticipants: number,
        public user_id: string
    ) { }

    static create(object: { [key: string]: any }): [string?, CreatePollDto?] {
        const { title, description, numberOfParticipants, user_id } = object;

        if (!title || title.length < 3) {
            return ['The title is not valid'];
        }

        if (!description) {
            return ['The description is not valid'];
        }

        if (!numberOfParticipants || numberOfParticipants < 3) {
            return ['The numberOfParticipants is not valid'];
        }

        if (!MongooseAdapter.isValidId(user_id)) {
            return ['The user_id is not valid'];
        }

        return [undefined, new CreatePollDto(title, description, numberOfParticipants, user_id)];
    }
}