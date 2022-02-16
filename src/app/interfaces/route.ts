export interface Route {
  debugOutput: {
    pathCalculationTime: number;
    pathTime: number[];
    precalculationTime: number;
    renderingTime: number;
    timedOut: boolean;
    totalTime: number;
  };
  elevationMetadata: {
    ellipsoidToGeoidDifference: number;
    geoidElevation: boolean;
  };
  plan: {
    data: number;
    from: {
      lat: number;
      lon: number;
      name: string;
      orig: string;
      vertexType: string;
    };
    to: {
      lat: number;
      lon: number;
      name: string;
      orig: string;
      vertexType: string;
    };
    itineraries: {
      duration: number;
      legs: {
        elevationGained: number;
        elevationLost: number;
        endTime: number;
        fare: {
          details: {
            regular: {
              fareId: string;
              price: {
                currency: {
                  currency: string;
                  currencyCode: string;
                  defaultFractionDigit: number;
                  symbol: string;
                };
                cents: number;
              };
              routes: string[];
            };
          };
          fare: {
            regular: {
              cents: number;
              currency: {
                currency: string;
                currencyCode: string;
                defaultFractionDigit: number;
                symbol: string;
              };
            };
          };
        };
        startTime: number;
        tooSloped: boolean;
        transfers: number;
        transitTime: number;
        waitingTime: number;
        walkDistance: number;
        walkLimitExceeded: boolean;
        walkTime: number;
      }[];
    };
  };
}