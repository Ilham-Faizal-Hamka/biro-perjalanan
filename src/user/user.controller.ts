import { Controller, Post, HttpCode, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { WebResponse } from "../model/web.model";
import { LoginUserRequest, RegisterUserRequest, UserResponse } from "../model/user.model";

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
}