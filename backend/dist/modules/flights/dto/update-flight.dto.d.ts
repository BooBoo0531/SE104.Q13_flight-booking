export declare class IntermediateAirportDto {
    airportId: number;
    duration: number;
    note?: string;
}
export declare class UpdateFlightDto {
    flightCode?: string;
    price?: number;
    totalSeats?: number;
    startTime?: string;
    endTime?: string;
    planeId?: number;
    fromAirportId?: number;
    toAirportId?: number;
    status?: string;
    intermediateAirports?: IntermediateAirportDto[];
    duration?: number;
}
