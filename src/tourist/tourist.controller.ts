import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { TouristService } from "./tourist.service";
import { Auth } from "../common/auth.decorator";
import { User } from "@prisma/client";
import { CreateTouristRequest, TouristResponse } from "../model/tourist.model";
import { WebResponse } from "src/model/web.model";

@Controller('/tourist')
export class TouristController{
    constructor(private touristService: TouristService){}

    @Post('/create')
    @HttpCode(200)
    async create(@Auth() user: User, @Body() request: CreateTouristRequest,) : Promise<WebResponse<TouristResponse>>{
        const result = await this.touristService.create(user, request);
        return {
            data: result,
        };
    }
}