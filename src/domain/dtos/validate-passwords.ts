import { MongooseAdapter } from "../../config";

export class ValidatePasswordsDto {
    constructor(
        public password: string,
        public password2: string,
        public _id: string
    ) { }

    static create(object: { [key: string]: any }): [string?, ValidatePasswordsDto?] {
        const { password, password2, _id } = object;

        if (!MongooseAdapter.isValidId(_id)) {
            return ['_Id not valid']
        }

        if (!password || password.length < 6) {
            return ['Password not valid'];
        }

        if (!password2 || password2.length < 6) {
            return ['Password2 not valid'];
        }

        if (password !== password2) {
            return ['The passwords are different'];
        }

        return [undefined, new ValidatePasswordsDto(password, password2, _id)];
    }
}