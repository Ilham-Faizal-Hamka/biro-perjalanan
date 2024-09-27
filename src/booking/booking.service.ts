import { HttpException, Inject, Injectable } from "@nestjs/common";
import { Logger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { ValidationService } from "../common/validation.service";
import { PrismaService } from "../common/prisma.service";
import { User, Tourist, Booking, Trip } from "@prisma/client";
import { BookingValidation } from "./booking.validation";
import { BookingResponse, CreateBookingRequest } from "src/model/booking.model";

@Injectable()
export class BookingService{
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger:Logger,
        private prismaService: PrismaService
    ){}

    async checkTouristExistence(id: number): Promise<Tourist>{
        const tourist = await this.prismaService.tourist.findFirst({
            where: {
                id: id,
            }
        });

        if(!tourist){
            throw new HttpException('Tourist not found', 404);
        }

        return tourist;
    }

    async checkTripExistence(id: number): Promise<Trip>{
        const trip = await this.prismaService.trip.findFirst({
            where: {
                id: id,
            }
        });

        if(!trip){
            throw new HttpException('Trip not found, please create it first', 404);
        }

        return trip;
    }


    async booking(user: User, request: CreateBookingRequest): Promise<Booking>{
        this.logger.debug(`BookingService.booking(${JSON.stringify(user)}, ${JSON.stringify(request)})`)
        const bookingRequest: CreateBookingRequest = this.validationService.validate(BookingValidation.CREATE, request);


        const tourist = await this.checkTouristExistence(bookingRequest.touristId);
        const trip = await this.checkTripExistence(bookingRequest.tripId);

        const booking = await this.prismaService.booking.create({
            data: {
                touristId: tourist.id,
                tripId: trip.id,
            },
            include: {
                tourist: true,
                trip: true,
            }
        });

        return booking;
    }

    async cancel(bookingId: number): Promise<Booking>{
        this.logger.debug(`BookingService.cancel(${JSON.stringify(bookingId)})`)
        const booking = await this.prismaService.booking.findFirst({
            where: {
                id: bookingId,
            }
        });

        if(!booking){
            throw new HttpException('Booking not found', 404);
        }

        await this.prismaService.booking.delete({
            where: {
                id: bookingId,
            }
        });

        return booking;
    }
}

