import { RegularExpressions } from "../../config/regular-expressions";

export class RegisterUserDto {
    constructor(
        public email: string,
        public password: string,
        private password2: string,
        public name: string
    ) { }

    static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
        const { email, password, password2, name } = object;


        if (!email || !RegularExpressions.email.test(email)) {
            return ['Email is not valid'];
        }

        if (!password || password.length < 6) {
            return ['Password is not valid'];
        }

        if (!password2 || password2.length < 6) {
            return ['Password2 is not valid'];
        }

        if (password !== password2) {
            return ['The passwords are different'];
        }

        if (!name || name.length < 3) {
            return ['The name is not valid'];
        }

        return [undefined, new RegisterUserDto(email, password, password2, name)];
    }
}