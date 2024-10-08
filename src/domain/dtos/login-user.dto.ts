import { RegularExpressions } from "../../config/regular-expressions";

export class LoginUserDto {
    constructor(
        public password: string,
        public user: string
    ) { }

    static create(object: { [key: string]: any }): [string?, LoginUserDto?] {
        const { password, user } = object;

        if (!RegularExpressions.email.test(user)) {
            return ['Email is not valid'];
        }

        if (!password || password.length < 6) {
            return ['Password is not valid'];
        }

        return [undefined, new LoginUserDto(password, user)];
    }
}