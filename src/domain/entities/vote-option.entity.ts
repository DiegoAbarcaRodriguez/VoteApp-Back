import { MongooseAdapter } from "../../config";
import { CustomError } from "../errors/custom.error";

export class VoteOptionEntity {


    constructor(
        public _id: string,
        public title: string,
        public description: string,
        public amount: number,
        public img: string,
        public poll_id: string
    ) { }

    static fromObject(object: { [key: string]: any }) {
        const { _id, title, amount = 0, description, img, poll_id } = object;

        if (!_id || !MongooseAdapter.isValidId(_id)) {
            throw CustomError.badRequest('_id is not valid');
        }

        if (!poll_id || !MongooseAdapter.isValidId(poll_id)) {
            throw CustomError.badRequest('poll_id is not valid');
        }

        if (!title) {
            throw CustomError.badRequest('Mising title');
        }

        if (title.length < 3) {
            throw CustomError.badRequest('The length of title must be greater than 3');
        }

        if (!description) {
            throw CustomError.badRequest('Mising description');
        }

        if (!img) {
            throw CustomError.badRequest('Missing img');
        }

        if (amount < 0) {
            throw CustomError.badRequest('Amount must be positive');
        }

        return new VoteOptionEntity(_id, title, description, amount, img, poll_id);

    }
}


