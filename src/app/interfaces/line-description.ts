export interface LineDescription {
    description: string;
    type: string;
    features: {
        type: string;
        properties: {
            NUMERO: string;
            PMR: string;
            COULEUR: string;
            CODE: string;
            LIBELLE: string;
            ZONES_ARRET: string[];
            type: string;
            id: string;
            shape: string;
        };
        description: string;
        geometry: {
            type: string;
            coordinates: [number, number][][] | [number, number][];
        }
    }[]
}
