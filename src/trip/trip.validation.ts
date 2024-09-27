import { ZodType, z } from "zod";

export class TripValidation{
    static readonly CREATE: ZodType = z.object({
        code: z.string().min(1).max(100),
        destination: z.string().min(1).max(100),
        hotel: z.string().min(1).max(100),
        transport: z.string().min(1).max(100),
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
    });

    static readonly UPDATE: ZodType = z.object({
        id: z.number().positive(),
        destination: z.string().min(1).max(100),
        hotel: z.string().min(1).max(100),
        transport: z.string().min(1).max(100),
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
    });
}
