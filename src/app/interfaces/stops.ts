export interface Stops {
    description: string;
    type: 'FeatureCollection';
    features: {
        type: string;
        properties: {
            CODE: string
            LIBELLE: string;
            COMMUNE: string;
            arr_visible: '1' | '0';
            type: 'arret';
            id: string;
        };
        description: string;
        geometry: {
            type: 'Point';
            coordinates: [number, number];
        }
    }[];
}
