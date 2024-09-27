import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { TripService } from "./trip.service";
import { Auth } from "../common/auth.decorator";
import { User } from "@prisma/client";
import { CreateTripRequest, TripResponse, UpdateTripRequest } from "../model/trip.model";
import { WebResponse } from "../model/web.model";

@Controller('/admin/trip')
export class TripController{
    constructor(private tripService: TripService){}

    @Post('/create')
    @HttpCode(200)
    async create(
        @Auth() user: User, 
        @Body() request: CreateTripRequest,
    ) : Promise<WebResponse<TripResponse>>{
        const result = await this.tripService.create(user, request);
        return {
            data: result,
        };
    }

    @Get('/:tripId')
    @HttpCode(200)
    async get(
        @Auth() user: User, 
        @Param('tripId', ParseIntPipe) tripId: number,
    ): Promise<WebResponse<TripResponse>>{
        const result = await this.tripService.get(tripId);
        return {
            data: result,
        };
    }

    @Put('/:tripId')
    @HttpCode(200)
    async update(
        @Auth() user: User,
        @Param('tripId', ParseIntPipe) tripId: number,
        @Body() request: UpdateTripRequest,
    ) : Promise<WebResponse<TripResponse>>{
        request.id = tripId;
        const result = await this.tripService.update(user, request);
        return {
            data: result,
        };
    }

    @Delete('/:tripId')
    @HttpCode(200)
    async delete(
        @Auth() user: User,
        @Param('tripId', ParseIntPipe) tripId: number,
    ) : Promise<WebResponse<TripResponse>>{
        const result = await this.tripService.remove(tripId);
        return {
            data: result,
        };
    }

    @Get('/')
    @HttpCode(200)
    async list(
        @Auth() user: User,
    ): Promise<WebResponse<TripResponse[]>>{
        const result = await this.tripService.list();
        return {
            data: result,
        };
    }
}