import { ZodType, z } from "zod";

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        username: z.string().max(100).min(4),
        name: z.string().min(4).max(100),
        email: z.string().min(4).max(100).email(),
        password: z.string().min(4).max(100),
    });

    static readonly LOGIN: ZodType = z.object({
        username: z.string().max(100).min(4),
        password: z.string().min(4).max(100),
    });

    static readonly UPDATE: ZodType = z.object({
        name: z.string().min(4).max(100).optional(),
        email: z.string().min(4).max(100).email().optional(),
        password: z.string().min(4).max(100).optional(),
    });
}