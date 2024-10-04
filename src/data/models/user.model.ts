import { model, Schema } from "mongoose";

const userSchema = new Schema(
    {
        email: {
            type: String,
            require: [true, 'email is required'],
            unique: true
        },
        password: {
            type: String,
            require: [true, 'password is required']
        },
        validated: {
            type: Boolean,
            default: false
        },
        token: {
            type: String,
            default: null
        },
        name: {
            type: String,
            require: [true, 'The name is required'],
            unique: true

        },
        google: {
            type: Boolean,
            require: [true, 'The google parameter is required'],
        },
        isActive: {
            type: Boolean,
            default: false
        }
    }
);

export const userModel = model('user', userSchema);