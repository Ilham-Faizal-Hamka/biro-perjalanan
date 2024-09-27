export class CreateTripRequest{
    code: string;
    destination: string;
    hotel: string;
    transport: string;
    startDate: Date;
    endDate: Date;
}

export class TripResponse{
    id: number;
    code: string;
    destination: string;
    hotel: string;
    transport: string;
    startDate: Date;
    endDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
}

export class UpdateTripRequest{
    id: number;
    destination: string;
    hotel: string;
    transport: string;
    startDate: Date;
    endDate: Date;
}

