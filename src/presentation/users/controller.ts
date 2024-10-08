import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.error";
import { UserService } from "../services/user.service";
import { LoginUserDto } from "../../domain/dtos/login-user.dto";
import { RegisterUserDto } from "../../domain/dtos/register-user.dto";
import { RegularExpressions } from '../../config/regular-expressions';
import { ValidatePasswordsDto } from "../../domain/dtos/validate-passwords";



export class UserController {
    constructor(private userService: UserService) { }


    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.log(`${error}`);
        return res.status(500).json('Internal Server Error');

    };

    signIn = async (req: Request, res: Response) => {

        const [error, loginUserDto] = LoginUserDto.create(req.body);

        if (error) {
            res.status(400).json({ message: error });
        }

        this.userService.login(loginUserDto!)
            .then(response => res.json(response))
            .catch(error => this.handleError(error, res));


    }

    signUp = async (req: Request, res: Response) => {

        const { name, email } = req.body;
        const nameString = name as string;
        const emailString = email as string;
        const [error, registerUserDto] = RegisterUserDto.create({ ...req.body, name: nameString.toLocaleLowerCase().trim(), email: emailString.toLocaleLowerCase().trim() });

        if (error) {
            res.status(400).json({ message: error });
        }

        this.userService.register(registerUserDto!)
            .then(() => res.status(201).json({ message: 'User created succesfully' }))
            .catch(error => this.handleError(error, res));

    }

    checkJWT = (req: Request, res: Response) => {
        const { user } = req.body;

        this.userService.checkJWT(user._id)
            .then((response) => res.json(response))
            .catch(error => this.handleError(error, res));


    }

    checkXToken = (req: Request, res: Response) => {
        const { user, isValidatedEmailFlow = false } = req.body;

        this.userService.checkXtoken(user._id, isValidatedEmailFlow)
            .then((response) => res.json(response))
            .catch((error) => this.handleError(error, res));

    }

    recoverPassword = (req: Request, res: Response) => {
        const { email } = req.body;

        if (!RegularExpressions.email.test(email)) {
            res.status(400).json({ message: 'The email is not valid' });
        }

        this.userService.recoverPassword(email)
            .then((response) => res.json(response))
            .catch(error => this.handleError(error, res));

    }

    updatePassword = (req: Request, res: Response) => {
        const [error, validatePasswordDto] = ValidatePasswordsDto.create(req.body);

        if (error) {
            res.status(400).json({ message: error });
        }

        this.userService.updatePassword(validatePasswordDto!)
            .then(() => res.json({ ok: true }))
            .catch((error) => this.handleError(error, res));


    }
    closeUserSession = (req: Request, res: Response) => {
        const { email } = req.body;

        if (!email || !RegularExpressions.email.test(email)) {
            res.status(400).json({ ok: false, message: 'The email entered is not valid' });
        }

        this.userService.closeUserSession(email)
            .then(() => res.json({ ok: true }))
            .catch((error) => this.handleError(error, res));


    }

    google = (req: Request, res: Response) => {

        const { accessToken } = req.body;

        if (!accessToken) {
            res.status(400).json({ message: 'The token is not valid' });
        }

        this.userService.loginGoogle(accessToken)
            .then((payload) => res.json(payload))
            .catch(error => this.handleError(error, res));
    }
}