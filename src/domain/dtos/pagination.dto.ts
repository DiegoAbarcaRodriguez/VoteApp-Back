export class PaginationDto {
    constructor(
        public limit: number,
        public page: number
    ) { }

    static create(object: { [key: string]: any }): [string?, PaginationDto?] {
        const { limit, page } = object;

        if (limit < 0 || typeof limit == 'undefined') {
            return ['Limit is not valid'];
        }

        if (page < 0 || !page || typeof limit == 'undefined') {
            return ['Page is not valid'];
        }

        return [undefined, new PaginationDto(limit, page)];
    }
}