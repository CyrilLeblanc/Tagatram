export interface PoleSchedule {
    pattern: {
        id: string;
        desc: string;
        dir: '1' | '2';
        shortDesc: string;
    };
    times: {
        stopId: string;
        stopName: string;
        scheduledArrival: number;
        scheduledDeparture: number;
        realtimeArrival: number;
        realtimeDeparture: number;
        arrivalDelay: number;
        departureDelay: number;
        timepoint: boolean;
        realtime: boolean;
        serviceDay: number;
        tripId: string;
    }[];
}
