export class UpdateVoteDto {

    constructor(
        public _id: string,
        public amount: number,
        public title?: string,
        public description?: String,
        public img?: string
    ) { }

    get values() {
        let object: { [key: string]: any } = {};

        if (this.title) object.title = this.title;
        if (this.description) object.description = this.description
        if (this.img) object.img = this.img;
        if (this.amount) object.amount = this.amount;

        return object;

    }

    static create(object: { [key: string]: any }): [string?, UpdateVoteDto?] {
        const { _id, title, description, amount = 0, img } = object;

        if (!_id) return ['Mising _id'];
        if (amount < 0) ['Amount cannot be negative'];
        return [undefined, new UpdateVoteDto(_id, amount, title, description, img)];

    }
}