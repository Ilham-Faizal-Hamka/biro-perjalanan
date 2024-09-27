import { HttpException, Inject, Injectable } from "@nestjs/common";
import { Logger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { ValidationService } from "../common/validation.service";
import { PrismaService } from "../common/prisma.service";
import { User, Tourist, Trip, Booking } from "@prisma/client";
import { CreateTripRequest, TripResponse, UpdateTripRequest } from "../model/trip.model";
import { TripValidation } from "./trip.validation";


@Injectable()
export class TripService{
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger:Logger,
        private prismaService: PrismaService
    ){}

    toTripResponse(trip: Trip): TripResponse{
        return {
            id: trip.id,
            code: trip.code,
            destination: trip.destination,
            hotel: trip.hotel,
            transport: trip.transport,
            startDate: trip.startDate,
            endDate: trip.endDate,
            createdBy: trip.createdBy,
            updatedBy: trip.updatedBy,
            createdAt: trip.createdAt,
            updatedAt: trip.updatedAt,
        }
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

    async create(user: User, request: CreateTripRequest,) : Promise<TripResponse>{
        this.logger.debug(`TripService.create(${JSON.stringify(user)}, ${JSON.stringify(request)})`)
        const createRequest: CreateTripRequest = this.validationService.validate(TripValidation.CREATE, request);

        // chect tourist is it already registered
        const totalTripWithSameTripCode = await this.prismaService.trip.count({
            where: {
                code: createRequest.code,
            }
        });

        if(totalTripWithSameTripCode != 0){
            throw new HttpException('Trip already exist', 400);
        }

        const trip = await this.prismaService.trip.create({
            data: {
                ...createRequest,
                ...{createdBy: user.username}
                },
        });
        
        return this.toTripResponse(trip);
    }


    //get spesific tourist data
    async get(tripId: number) : Promise<TripResponse>{
        this.logger.debug(`TouristService.get(${JSON.stringify(tripId)})`)
        const tripData = await this.checkTripExistence(tripId);
        return this.toTripResponse(tripData);
    }

    async update(user: User, request: UpdateTripRequest) : Promise<TripResponse>{
        this.logger.debug(`TripService.update(${JSON.stringify(user)}, ${JSON.stringify(request)})`)
        const updateRequest: UpdateTripRequest = this.validationService.validate(TripValidation.UPDATE, request);

        let trip = await this.checkTripExistence(updateRequest.id);

        trip = await this.prismaService.trip.update({
            where: {
                id: updateRequest.id,
            },
            data: {
                ...updateRequest,
                ...{updatedBy: user.username}
            }
        });

        return this.toTripResponse(trip);
    }

    async remove(tripId: number): Promise<TripResponse>{
        this.logger.debug(`TripService.remove(${tripId})`)
        const trip = await this.checkTripExistence(tripId);

        await this.prismaService.tourist.delete({
            where: {
                id: trip.id,
            }
        });

        return this.toTripResponse(trip);
    }

    async list(): Promise<TripResponse[]>{
        this.logger.debug(`TouristService.list()`)
        const trips = await this.prismaService.trip.findMany();
        return trips.map(trip => this.toTripResponse(trip));
    }
}

