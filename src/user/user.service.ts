import { HttpException, Inject, Injectable } from "@nestjs/common";
import { RegisterUserRequest, LoginUserRequest, UserResponse, UpdateUserRequest } from "../model/user.model";
import { ValidationService } from "../common/validation.service";
import { Logger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "../common/prisma.service";
import { UserValidation } from "./user.validation";
import * as bcrypt from "bcrypt";
import { v4 as uuid} from "uuid";
import { User } from "@prisma/client";

@Injectable()
export class UserService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
    ) {}


    async register(request: RegisterUserRequest) : Promise<UserResponse>{
        this.logger.info(`Register new user ${JSON.stringify(request)}`);
        const registerRequest: RegisterUserRequest = this.validationService.validate(UserValidation.REGISTER, request);

        //check username is it exists
        const totalUserWithSameUsername = await this.prismaService.user.count({
            where: {
                username: registerRequest.username,
            }
        });

        if (totalUserWithSameUsername != 0) {
            throw new HttpException('Username already exists', 400);
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);
        
        const user = await this.prismaService.user.create({
            data: registerRequest,
        });

        return {
            username: user.username,
            name: user.name,
            email: user.email,
        };
    }

    async login(request: LoginUserRequest) : Promise<UserResponse>{
        this.logger.debug(`UserService.login(${JSON.stringify(request)})`);

        const loginRequest: LoginUserRequest = this.validationService.validate(UserValidation.LOGIN, request);

        let user = await this.prismaService.user.findUnique({
            where: {
                username: loginRequest.username,
            }
        });

        if(!user){
            throw new HttpException('username or password is invalid', 401);
        }

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

        if(!isPasswordValid){
            throw new HttpException('username or password is invalid', 401);
        }

        user = await this.prismaService.user.update({
            where: {
                username: loginRequest.username,
            },
            data: {
                token: uuid(),
            }
        });

        return {
            username: user.username,
            name: user.name,
            token: user.token,
            email: user.email,
        }
    }

    async get(user: User): Promise<UserResponse>{
        return{
            username: user.username,
            name: user.name,
            email: user.email,
        }
    }

    async update(user: User, request: UpdateUserRequest,) : Promise<UserResponse>{
        this.logger.debug(`UserService.update(${JSON.stringify(request)}, ${JSON.stringify(user)})`);

        const updateRequest: UpdateUserRequest = this.validationService.validate(UserValidation.UPDATE, request);

        if(updateRequest.name){
            user.name = updateRequest.name;
        }

        if(updateRequest.email){
            user.email = updateRequest.email;
        }

        if(updateRequest.password){
            user.password = updateRequest.password;
        }

        const result = await this.prismaService.user.update({
            where: {
                username: user.username,
            },
            data: user,
        });

        return {
            username: result.username,
            name: result.name,
            email: result.email,
        }
    }

    async logout(user: User,) : Promise<UserResponse>{
        const result = await this.prismaService.user.update({
            where: {
                username: user.username,
            },
            data: {
                token: null,
            }
        });

        return {
            username: result.username,
            name: result.name,
            email: result.email,
        }
    }
}