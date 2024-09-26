import { ZodType, z } from "zod";

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        username: z.string().max(100).min(1),
        name: z.string().min(1).max(100),
        email: z.string().min(1).max(100).email(),
        password: z.string().min(1).max(100),
    });

    static readonly LOGIN: ZodType = z.object({
        username: z.string().max(100).min(1),
        password: z.string().min(1).max(100),
    });
}