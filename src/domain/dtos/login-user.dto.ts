import { RegularExpressions } from "../../config/regular-expressions";

export class LoginUserDto {
    constructor(
        public password: string,
        public user: string,
        public isByEmail?: boolean

    ) { }

    static create(object: { [key: string]: any }): [string?, LoginUserDto?] {
        const { password, user, isByEmail = true } = object;


        if (typeof isByEmail !== 'boolean') {
            return ['isByEmail flag not valid'];
        }

        if (isByEmail && !RegularExpressions.email.test(user)) {
            return ['Email is not valid'];
        }
        if (!isByEmail && !user) {
            return ['User not valid'];
        }

        if (!password || password.length < 6) {
            return ['Password is not valid'];
        }

        return [undefined, new LoginUserDto(password, user, isByEmail)];
    }
}