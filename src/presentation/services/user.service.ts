import { bcryptAdapter, JwtAdapter, UuidAdapter, VerifyGoogleAdapter } from "../../config";
import { userModel } from "../../data/models/user.model";
import { LoginUserDto } from "../../domain/dtos/login-user.dto";
import { RegisterUserDto } from "../../domain/dtos/register-user.dto";
import { ValidatePasswordsDto } from "../../domain/dtos/validate-passwords";
import { CustomError } from "../../domain/errors/custom.error";
import { EmailService } from "./email.service";
import { WssService } from "./wss.service";

export class UserService {
    constructor(
        private emailService: EmailService,
        private wssService: WssService
    ) { }

    login = async (loginUserDto: LoginUserDto) => {

        try {

            let user: any;
            let userByName: any;

            if (loginUserDto.isByEmail) {
                user = await userModel.findOne({ email: loginUserDto.user });

                if (!user || !user.validated) {
                    throw CustomError.notFound('The user does not exist or has not been validated');
                }

                if (user.isActive) {
                    await userModel.findOneAndUpdate({ email: loginUserDto.user }, { isActive: false }, { new: true });
                    this.wssService.sendAlertActiveAccount(user.email);
                    throw CustomError.forbidden('There is a session initiated!');
                }

                await userModel.findOneAndUpdate({ email: user.email }, { isActive: true }, { new: true });

            }

            if (!loginUserDto.isByEmail) {
                userByName = await userModel.findOne({ name: loginUserDto.user });

                if (!userByName || !userByName.validated) {
                    throw CustomError.notFound('The user does not exist or has not been validated');
                }

                if (userByName.isActive) {
                    await userModel.findOneAndUpdate({ name: loginUserDto.user }, { isActive: false }, { new: true });
                    this.wssService.sendAlertActiveAccount(userByName.email);
                    throw CustomError.forbidden('There is a session initiated!');
                }

                await userModel.findOneAndUpdate({ name: loginUserDto.user }, { isActive: true }, { new: true });
            }


            if (!bcryptAdapter.compare(loginUserDto.password, loginUserDto.isByEmail ? user.password : userByName.password)) {
                throw CustomError.unauthorized('The password or email is incorrect');
            }

            const token = await JwtAdapter.generateToken({ _id: loginUserDto.isByEmail ? user._id : userByName._id });

            if (!token) {
                throw CustomError.internalServer('It has ocurred an error by generating the token');
            }


            if (loginUserDto.isByEmail) {
                return {
                    ok: true,
                    token,
                    user
                }

            } else {
                return {
                    ok: true,
                    token,
                    userByName
                }

            }




        } catch (error) {
            console.log(error);
            throw error;
        }



    }

    register = async (registerUserDto: RegisterUserDto) => {

        try {

            const user = await userModel.findOne({ email: registerUserDto.email });
            const userByName = await userModel.findOne({ name: registerUserDto.name })

            if (user) {
                throw CustomError.badRequest('The email already registered');
            }

            if (userByName) {
                throw CustomError.badRequest('The name already registered');
            }

            const token = UuidAdapter.v4();
            if (!token) {
                throw CustomError.internalServer('It has ocurred an error generating the token');
            }


            const newUser: any = await userModel.create({
                ...registerUserDto,
                token,
                password: bcryptAdapter.hash(registerUserDto.password),
                google: false
            });



            const wasEmailSent = await this.emailService.sendEmailToValidateAccount(newUser.email, token);

            if (!wasEmailSent) {
                throw CustomError.internalServer('It has ocurred an error sending the email');
            }

            return true;


        } catch (error) {
            console.log(error);
            throw error;
        }

    }


    checkJWT = async (_id: string) => {
        const token = await JwtAdapter.generateToken({ _id });
        if (!token) {
            throw CustomError.internalServer('There is been an error by generating the token');
        }

        return {
            ok: true,
            token
        }
    }

    checkXtoken = async (_id: string, isValidatedEmailFlow: boolean = false) => {

        try {

            await userModel.findByIdAndUpdate(_id, { token: null }, { new: true });

            if (isValidatedEmailFlow) {
                await userModel.findByIdAndUpdate(_id, { validated: true }, { new: true });
            }

            return {
                ok: true,
                _id
            }

        } catch (error) {
            console.log(error);
            throw error;
        }


    }

    recoverPassword = async (email: string) => {

        try {
            const user = await userModel.findOne({ email });

            if (!user) {
                throw CustomError.notFound('User not found whith that email');
            }

            if (user!.google) {
                throw CustomError.forbidden('Cannot change the password of an user registered by Google');
            }

            const token = UuidAdapter.v4();
            if (!token) {
                throw CustomError.internalServer('It has ocurred an error generating the token');
            }

            await userModel.findByIdAndUpdate(user._id, { token }, { new: true });

            const wasEmailSent = await this.emailService.sendEmailToRecoverPassword(email, token);
            if (!wasEmailSent) {
                throw CustomError.internalServer('It has ocurred an error sending the email');
            }

            return true;

        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    updatePassword = async (validatePasswordDto: ValidatePasswordsDto) => {
        try {
            const user = await userModel.findById(validatePasswordDto._id);
            if (!user) {
                throw CustomError.notFound('User not found');
            }

            await userModel.findByIdAndUpdate(validatePasswordDto._id, { password: bcryptAdapter.hash(validatePasswordDto.password) }, { new: true });

            return true;

        } catch (error) {
            console.log(error);
            throw error;
        }
    }


    closeUserSession = async (email: string) => {
        try {
            const user = await userModel.findOne({email});
            if (!user) {
                throw CustomError.notFound('User not found');
            }

            user.isActive = false;
            await user.save()

            return true;

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    loginGoogle = async (accessToken: string) => {
        try {
            const response = await VerifyGoogleAdapter.googleVerify(accessToken);

            if (!response) {
                throw CustomError.internalServer('Has occurred a problem with the google services');
            }

            const { given_name, email } = response!

            const userByEmail = await userModel.findOne({ email });
            const userByName = await userModel.findOne({ name: given_name });

            if ((userByEmail && !userByEmail.google) || (userByName && !userByName.google)) {
                throw CustomError.badRequest('The credentials of the google account already belong another account registered by conventional flow!');
            }

            const user = {
                name: given_name,
                email,
                validated: true,
                password: '@@@',
                google: true
            }

            let _id;

            if (!userByName?.google || !userByEmail?.google) {
                _id = (await userModel.create(user))._id;
            }

            if (userByName?.google) {

                _id = userByName._id;

                if (userByName.isActive) {
                    await userModel.findByIdAndUpdate(_id, { isActive: false }, { new: true });
                    this.wssService.sendAlertActiveAccount(userByName.email!);
                    throw CustomError.forbidden('There is a session initiated!');
                }

                await userModel.findByIdAndUpdate(_id, { isActive: true }, { new: true });
            }

            if (userByEmail?.google) {

                _id = userByEmail._id;

                if (userByEmail.isActive) {
                    await userModel.findByIdAndUpdate(_id, { isActive: false }, { new: true });
                    this.wssService.sendAlertActiveAccount(userByEmail.email!);
                    throw CustomError.forbidden('There is a session initiated!');
                }

                await userModel.findByIdAndUpdate(_id, { isActive: true }, { new: true });
            }

            const token = await JwtAdapter.generateToken({ _id });

            if (!token) {
                throw CustomError.internalServer('It has ocurred an error by generating the token');
            }


            return {
                user,
                token
            };

        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}