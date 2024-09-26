import { Module } from "@nestjs/common";
import { TouristService } from "./tourist.service";
import { TouristController } from "./tourist.controller";

@Module({
    providers: [TouristService],
    controllers: [TouristController]
})
export class TouristModule{}