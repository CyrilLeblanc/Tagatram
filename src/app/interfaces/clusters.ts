export interface Clusters {
    type: 'FeatureCollection';
    features: {
        type: string;
        properties: {
            city: string;
            code: string;
            dist: number;
            epci: string;
            id: string;
            importance: number;
            name: string;
            type: 'clusters';
            visible: boolean;
        }
        geometry: {
            type: 'Point';
            coordinates: [number, number];
        }
    }[]
}
