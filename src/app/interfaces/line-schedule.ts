export interface LineSchedule {
    [key: string]: {
        arrets: {
            stopId: string;
            trips: number[];
            stopName: string;
            lat: number;
            lon: number;
            parentStation: {
                id: string;
                code: string;
                city: string;
                name: string;
                visible: string;
                lat: number;
                lon: number;
            }
        }[];
        trips: {
            tripId: string;
            pickupType: string;
        }[];
        prevTime: number;
        nextTime: number;
    }
}
