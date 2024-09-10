import { MongooseAdapter } from "../../config";
import { CustomError } from "../errors/custom.error";

export class PollEntity {


    constructor(
        public _id: string,
        public user_id: string,
        public title: string,
        public description: string,
        public numberOfParticipants: number,

    ) { }

    static fromObject(object: { [key: string]: any }) {
        const { _id, title, numberOfParticipants = 0, description, user_id } = object;

        if (!_id || !MongooseAdapter.isValidId(_id)) {
            throw CustomError.badRequest('Mising _id');
        }

        if (!title) {
            throw CustomError.badRequest('Mising title');
        }

        if (!description) {
            throw CustomError.badRequest('Mising description');
        }

        if (!user_id || !MongooseAdapter.isValidId(user_id)) {
            throw CustomError.badRequest('Missing user_id');
        }

        if (numberOfParticipants < 3) {
            throw CustomError.badRequest('The number of participants must be greater than 3');
        }

        return new PollEntity(_id, user_id, title, description, numberOfParticipants);

    }
}


