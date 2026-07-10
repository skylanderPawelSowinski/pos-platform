import type { ContentfulStatusCode } from "hono/utils/http-status";

export abstract class ApiError extends Error {
    abstract readonly status: ContentfulStatusCode;
    abstract readonly code: string;

    constructor(message: string) {
        super(message);

        this.name = this.constructor.name;
    }
}