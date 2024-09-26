export class CreateTouristRequest{
    name: string;
    email: string;
    nik: string;
}

export class TouristResponse{
    nik: string;
    name: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
}


