export const httpAdapter = {
    get: async (url: string) => {
        try {
            const resp = await fetch(url);
            return await resp.json();
        } catch (error) {
            console.error(error);
            throw error;

        }
    }
}