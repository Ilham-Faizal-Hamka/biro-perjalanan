export class CreateTouristRequest{
    name: string;
    email: string;
    nik: string;
}

export class TouristResponse{
    id: number;
    nik: string;
    name: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
}

export class UpdateTouristRequest{
    id: number;
    name: string;
    email: string;
}


