import { HttpException, Inject, Injectable } from "@nestjs/common";
import { Logger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { ValidationService } from "../common/validation.service";
import { PrismaService } from "../common/prisma.service";
import { User, Tourist } from "@prisma/client";
import { CreateTouristRequest, TouristResponse, UpdateTouristRequest } from "../model/tourist.model";


@Injectable()
export class TouristService{
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger:Logger,
        private prismaService: PrismaService
    ){}

    toTouristResponse(tourist: Tourist): TouristResponse{
        return {
            id: tourist.id,
            nik: tourist.nik,
            name: tourist.name,
            email: tourist.email,
            createdAt: tourist.createdAt,
            updatedAt: tourist.updatedAt,
            createdBy: tourist.createdBy,
            updatedBy: tourist.updatedBy,
        }
    }

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

        

        const tourist = await this.prismaService.tourist.create({
            data: {
                ...createRequest,
                ...{createdBy: user.username}
                },
        });
        
        return this.toTouristResponse(tourist);
    }


    //get spesific tourist data
    async get(touristId: number) : Promise<TouristResponse>{
        this.logger.debug(`TouristService.get(${JSON.stringify(touristId)})`)
        const touristData = await this.checkTouristExistence(touristId);
        return this.toTouristResponse(touristData);
    }

    async update(user: User, request: UpdateTouristRequest) : Promise<TouristResponse>{
        this.logger.debug(`TouristService.update(${JSON.stringify(user)}, ${JSON.stringify(request)})`)
        const updateRequest: UpdateTouristRequest = this.validationService.validate(TouristValidation.UPDATE, request);

        let tourist = await this.checkTouristExistence(updateRequest.id);

        tourist = await this.prismaService.tourist.update({
            where: {
                id: updateRequest.id,
            },
            data: {
                ...updateRequest,
                ...{updatedBy: user.username}
            }
        });

        return this.toTouristResponse(tourist);
    }

    async remove(touristId: number): Promise<TouristResponse>{
        this.logger.debug(`TouristService.remove(${touristId})`)
        const tourist = await this.checkTouristExistence(touristId);
        await this.prismaService.tourist.delete({
            where: {
                id: tourist.id,
            }
        });

        return this.toTouristResponse(tourist);
    }

    async list(): Promise<TouristResponse[]>{
        this.logger.debug(`TouristService.list()`)
        const tourists = await this.prismaService.tourist.findMany();
        return tourists.map(tourist => this.toTouristResponse(tourist));
    }
}
import { TouristValidation } from "./tourist.validation";
