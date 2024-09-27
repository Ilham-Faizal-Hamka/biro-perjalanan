import { TouristResponse } from "./tourist.model";
import { TripResponse } from "./trip.model";

export class CreateBookingRequest{
    touristId: number;
    tripId: number;
}

export class BookingResponse{
    touristId: number;
    tripId: number;
    tourist: TouristResponse[];
    trip: TripResponse[];
}
