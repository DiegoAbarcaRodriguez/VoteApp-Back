import { OAuth2Client } from 'google-auth-library';
import { envs } from './env-var.adapter';


export class VerifyGoogleAdapter {

    static client: OAuth2Client = new OAuth2Client(envs.GOOGLE_SECRET);

    static async googleVerify(accessToken: string) {
        const ticket = await this.client.verifyIdToken({
            idToken: accessToken,
            audience: envs.GOOGLE_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
        return payload;
    }


}