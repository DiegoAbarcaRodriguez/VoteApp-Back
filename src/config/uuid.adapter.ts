import { v4 } from "uuid";

export class UuidAdapter {
    static v4() {
        return v4();
    }
}