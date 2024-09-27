import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { Auth } from "../common/auth.decorator";
import { Booking, User } from "@prisma/client";
import { WebResponse } from "src/model/web.model";
import { BookingService } from "./booking.service";
import { BookingResponse, CreateBookingRequest } from "src/model/booking.model";

@Controller('/admin/booking')
export class BookingController{
    constructor(private bookingService: BookingService){}
    
    @Post('/create')
    @HttpCode(200)
    async booking(
        @Auth() user: User, 
        @Body() request: CreateBookingRequest,
    ) : Promise<WebResponse<Booking>>{
        const result = await this.bookingService.booking(user, request);
        return {
            data: result,
        };
    }

    @Delete('/:bookingId')
    @HttpCode(200)
    async cancel(
        @Auth() user: User,
        @Param('bookingId', ParseIntPipe) bookingId: number,
    ) : Promise<WebResponse<Booking>>{
        const result = await this.bookingService.cancel(bookingId);
        return {
            data: result,
        };
    }


}