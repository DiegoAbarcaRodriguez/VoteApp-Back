import { model, Schema } from "mongoose";

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, 'email is required'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'password is required']
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
        }
    }
);

export const userModel = model('user', userSchema);