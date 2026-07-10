import { z } from "zod";

export const UUIDSchema =
    z.string()
        .uuid();


export const PaginationSchema =
    z.object({
        page:
            z.coerce
                .number()
                .int()
                .positive()
                .default(1),

        limit:
            z.coerce
                .number()
                .int()
                .positive()
                .max(100)
                .default(20),
    });


export type Pagination =
    z.infer<
        typeof PaginationSchema
    >;