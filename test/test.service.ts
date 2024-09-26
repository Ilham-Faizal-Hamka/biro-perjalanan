import { Injectable } from "@nestjs/common";
import { PrismaService } from "../src/common/prisma.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
    constructor(private prismaService: PrismaService) {}


    async deleteAll(){
        await this.deleteUser();
    }

    async deleteUser(){
        await this.prismaService.user.deleteMany({
            where: {
                username: {
                    contains: 'test'
                }
            }
        });
    }

    async createUser(){
        await this.prismaService.user.create({
            data: {
                username: 'test',
                password: await bcrypt.hash('test', 10),
                name: 'test',
                email: 'test@gmail.com',
                token: 'test',
            }
        });
    }

    async getUser(){
        return this.prismaService.user.findUnique({
            where: {
                username: 'test',
            }
        })
    }
}