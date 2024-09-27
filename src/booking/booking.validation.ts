import { ZodType, z } from "zod";

export class BookingValidation{
    static readonly CREATE: ZodType = z.object({
        touristId: z.number().positive(),
        tripId: z.number().positive(),
    });
}
