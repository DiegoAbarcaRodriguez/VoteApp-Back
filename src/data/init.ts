import mongoose from "mongoose";

interface Options {
    mongoUrl: string,
    dbName: string

}

export class MongoDataBase {
    static async connect(options: Options) {
        try {

            const { mongoUrl, dbName } = options;
            await mongoose.connect(mongoUrl, {
                dbName
            });

            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async disconnect() {
        await mongoose.disconnect();
    }
}