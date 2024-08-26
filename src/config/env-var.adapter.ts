import 'dotenv/config';
import { get } from "env-var";

export const envs = {
    PORT: get('PORT').required().asPortNumber(),

    MONGO_URL: get('MONGO_URL').required().asString(),
    MONGO_USER: get('MONGO_USER').required().asString(),
    MONGO_PASSWORD: get('MONGO_PASS').required().asString(),
    DB_NAME: get('DB_NAME').required().asString(),

    MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
    MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
    MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),

    JWT_SEED: get('JWT_SEED').required().asString(),

    GOOGLE_SECRET:get('GOOGLE_SECRET').required().asString(),
    GOOGLE_ID:get('GOOGLE_ID').required().asString(),





}