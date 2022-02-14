export interface Line {
    color: string;
    gtfsId: string;
    id: string;
    mode: 'BUS' | 'TRAM' | 'RAIL';
    name: string;
    shortName: string;
    textColor: string;
    type: 'TRAM' | 'C38' | 'CHRONO' | 'FLEXO' | 'SCOL' | 'NAVETTE' | 'SNC';
}
