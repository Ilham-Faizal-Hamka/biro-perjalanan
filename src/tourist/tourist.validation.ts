import { ZodType, z } from "zod";

export class TouristValidation{
    static readonly CREATE: ZodType = z.object({
        name: z.string().min(1).max(100),
        email: z.string().min(1).max(100),
        nik: z.string().min(1).max(100),
    });

    static readonly UPDATE: ZodType = z.object({
        id: z.number().positive(),
        name: z.string().min(1).max(100),
        email: z.string().min(1).max(100),
    });
}
