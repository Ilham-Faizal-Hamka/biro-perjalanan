import { Controller, Post, HttpCode, Body, Get, Patch, Delete } from "@nestjs/common";
import { UserService } from "./user.service";
import { WebResponse } from "../model/web.model";
import { LoginUserRequest, RegisterUserRequest, UserResponse } from "../model/user.model";
import { Auth } from "../common/auth.decorator";
import { User } from "@prisma/client";

@Controller('/')
export class UserController {
    constructor(private userService: UserService){
    }

    @Post('/register')
    @HttpCode(200)
    async register(@Body() request: RegisterUserRequest,): Promise<WebResponse<UserResponse>>{
        const result = await this.userService.register(request);
        return {
            data: result,
        };
    }

    @Post('/login')
    @HttpCode(200)
    async login(@Body() request: LoginUserRequest,): Promise<WebResponse<UserResponse>>{
        const result = await this.userService.login(request);
        return {
            data: result,
        };
    }

    @Get('/account')
    @HttpCode(200)
    async get(@Auth() user: User): Promise<WebResponse<UserResponse>>{
        const result = await this.userService.get(user);
        return {
            data: result,
        };
    }

    @Patch('/account')
    @HttpCode(200)
    async update(@Auth() user: User, @Body() request: RegisterUserRequest): Promise<WebResponse<UserResponse>>{
        const result = await this.userService.update(user, request);
        return {
            data: result,
        };
    }

    @Delete('/account')
    @HttpCode(200)
    async delete(@Auth() user: User): Promise<WebResponse<UserResponse>>{
        const result = await this.userService.logout(user);
        return {
            data: result,
        };
    }
}