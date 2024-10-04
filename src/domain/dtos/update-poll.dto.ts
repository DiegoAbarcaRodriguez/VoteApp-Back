import { MongooseAdapter } from "../../config";

export class UpdatePollDto {
    constructor(
        private title?: string,
        private description?: string,
        private numberOfParticipants?: number,
        private numberOfParticipations?: number,
    ) { }

    get value() {
        let object: { [key: string]: any } = {};

        if (this.title) {
            object.title = this.title;
        }
        if (this.description) {
            object.description = this.description;
        }
        if (this.numberOfParticipants) {
            object.numberOfParticipants = this.numberOfParticipants;
        }

        if (this.numberOfParticipations) {
            object.numberOfParticipants = this.numberOfParticipations;
        }

        return object;
    }

    static create(object: { [key: string]: any }): [string?, UpdatePollDto?] {
        const { title, description, numberOfParticipants = 0, numberOfParticipations = 0 } = object;



        if (!numberOfParticipants || numberOfParticipants < 3) {
            return ['The numberOfParticipants is not valid'];
        }

        if (!numberOfParticipations || numberOfParticipations < 0) {
            return ['The numberOfParticipations is not valid'];
        }

        return [undefined, new UpdatePollDto(title, description, numberOfParticipants, numberOfParticipations)];

    }

}