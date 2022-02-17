export interface Route {
  plan: {
    date: number;

    from: {
      lat: number;
      lon: number;
      name: 'Origin';
      vertexType: string;
    };

    to: {
      lat: number;
      lon: number;
      name: 'Destination';
      vertexType: string;
    };

    itineraries: {
      endTime: number; // timestamp in milliseconds
      startTime: number; // timestamp in milliseconds
      duration: number; // duration total in seconds
      transitTime: number; // duration in transit in seconds
      waitingTime: number; // duration in waiting in seconds
      walkTime: number; // duration in walking in seconds
      walkDistance: number; // distance in meters

      legs: {
        distance: number;
        duration: number;
        startTime: number;
        endTime: number;
        mode:
          | 'TRANSIT'
          | 'WALK'
          | 'BICYCLE'
          | 'TRAM'
          | 'BUS'
          | 'GONDOLA'
          | 'OTHER';
        route: string; // nom de la ligne
        routeColor: string;
        routeId: string;
        routeLongName: string;
        routeShortName: string;
        routeTextColor: string;

        from: {
          lat: number;
          lon: number;
          name: string;
          vertexType: string;
        };
        to: {
          lat: number;
          lon: number;
          name: string;
          vertexType: string;
        };
        steps: {
          absoluteDirection:
            | 'NORTH'
            | 'EAST'
            | 'SOUTH'
            | 'WEST'
            | 'NORTHEAST'
            | 'SOUTHEAST'
            | 'SOUTHWEST'
            | 'NORTHWEST';
          distance: number;
          lat: number;
          lon: number;
          streetName: string;
          relativeDirection: string;
        }[];
        intermediateStops: {
          arrival: number;
          departure: number;
          lat: number;
          lon: number;
          name: string;
          stopCode: string;
          stopId: string;
          vertexType: string;
        }[];
      }[];
    }[];
  };
  error?: {
    id: number;
    msg: string;
    message: string;
    noPath: boolean;
  };
}
