import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { TouristService } from "./tourist.service";
import { Auth } from "../common/auth.decorator";
import { User } from "@prisma/client";
import { CreateTouristRequest, TouristResponse, UpdateTouristRequest } from "../model/tourist.model";
import { WebResponse } from "src/model/web.model";

@Controller('/admin/tourist')
export class TouristController{
    constructor(private touristService: TouristService){}

    @Post('/create')
    @HttpCode(200)
    async create(
        @Auth() user: User, 
        @Body() request: CreateTouristRequest,
    ) : Promise<WebResponse<TouristResponse>>{
        const result = await this.touristService.create(user, request);
        return {
            data: result,
        };
    }

    @Get('/:touristId')
    @HttpCode(200)
    async get(
        @Auth() user: User, 
        @Param('touristId', ParseIntPipe) touristId: number,
    ): Promise<WebResponse<TouristResponse>>{
        const result = await this.touristService.get(touristId);
        return {
            data: result,
        };
    }

    @Put('/:touristId')
    @HttpCode(200)
    async update(
        @Auth() user: User,
        @Param('touristId', ParseIntPipe) touristId: number,
        @Body() request: UpdateTouristRequest,
    ) : Promise<WebResponse<TouristResponse>>{
        request.id = touristId;
        const result = await this.touristService.update(user, request);
        return {
            data: result,
        };
    }

    @Delete('/:touristId')
    @HttpCode(200)
    async delete(
        @Auth() user: User,
        @Param('touristId', ParseIntPipe) touristId: number,
    ) : Promise<WebResponse<TouristResponse>>{
        const result = await this.touristService.remove(touristId);
        return {
            data: result,
        };
    }

    @Get('/')
    @HttpCode(200)
    async list(
        @Auth() user: User,
    ): Promise<WebResponse<TouristResponse[]>>{
        const result = await this.touristService.list();
        return {
            data: result,
        };
    }
}