import { HttpException, Inject, Injectable } from "@nestjs/common";
import { Logger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { ValidationService } from "../common/validation.service";
import { PrismaService } from "../common/prisma.service";
import { User } from "@prisma/client";
import { CreateTouristRequest, TouristResponse } from "../model/tourist.model";


@Injectable()
export class TouristService{
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger:Logger,
        private prismaService: PrismaService
    ){}

    async create(user: User, request: CreateTouristRequest,) : Promise<TouristResponse>{
        this.logger.debug(`TouristService.create(${JSON.stringify(user)}, ${JSON.stringify(request)})`)
        const createRequest: CreateTouristRequest = this.validationService.validate(TouristValidation.CREATE, request);

        // chect tourist is it already registered
        const totalUserWithSameNik = await this.prismaService.tourist.count({
            where: {
                nik: createRequest.nik,
            }
        });

        if(totalUserWithSameNik != 0){
            throw new HttpException('NIK already registered', 400);
        }

        

        const result = await this.prismaService.tourist.create({
            data: {
                ...createRequest,
                ...{createdBy: user.username}
                },
        });
        
        return{
            nik: result.nik,
            name: result.name,
            email: result.email,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            createdBy: result.createdBy,
            updatedBy: result.updatedBy,
        }
    }
}
import { TouristValidation } from "./tourist.validation";
