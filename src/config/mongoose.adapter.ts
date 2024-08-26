import mongoose from "mongoose"

export const MongooseAdapter = {
    isValidId: (id: string) => {
        return mongoose.isValidObjectId(id);
    }
}