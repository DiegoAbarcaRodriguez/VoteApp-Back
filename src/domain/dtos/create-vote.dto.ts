export class CreateVoteDto {

    constructor(
        private title: string,
        private description: String,
        private amount: number,
        public img: string
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateVoteDto?] {
        const { title, description, img, amount = 0 } = object;

        if (!title || title.length < 4) return ['The format of title is incorect'];
        if (!description) return ['Mising description'];
        if (!img) return ['Mising image'];
        if (amount < 0) return ['Amount must cannot be negative'];

        return [undefined, new CreateVoteDto(title, description, amount, img)];

    }
}