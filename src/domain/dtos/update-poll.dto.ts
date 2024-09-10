import { MongooseAdapter } from "../../config";

export class UpdatePollDto {
    constructor(
        private user_id: string,
        private title?: string,
        private description?: string,
        private numberOfParticipants?: number
    ) { }

    get value() {
        let object: { [key: string]: any } = {};

        if (this.user_id) {
            object.user_id = this.user_id;
        }
        if (this.title) {
            object.title = this.title;
        }
        if (this.description) {
            object.description = this.description;
        }
        if (this.numberOfParticipants) {
            object.numberOfParticipants = this.numberOfParticipants;
        }

        return object;
    }

    static create(object: { [key: string]: any }): [string?, UpdatePollDto?] {
        const { title, description, numberOfParticipants = 0, user_id } = object;

        if (!user_id || !MongooseAdapter.isValidId(user_id)) {
            return ['Is not a valid user_id'];
        }
        
        if (!numberOfParticipants || numberOfParticipants < 3) {
            return ['The numberOfParticipants is not valid'];
        }

        return [undefined, new UpdatePollDto(user_id, title, description, numberOfParticipants)];

    }

}