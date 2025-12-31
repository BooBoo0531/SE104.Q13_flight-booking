declare class SeatConfigDto {
    ticketClassId: number;
    name: string;
    prefix: string;
    seatCount: number;
}
export declare class CreateAirplaneDto {
    name: string;
    code: string;
    economySeats: number;
    businessSeats: number;
    seatConfigs?: SeatConfigDto[];
}
export {};
