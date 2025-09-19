
export interface Property {
  id: string;
  title: string;
  type: 'Casa' | 'Departamento' | 'Terreno';
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  description: string;
  photos: string[];
  location: string;
  zipCode: string;
  nearbyPlaces: string[];
}

export interface LocationPlace {
  name: string;
  time: string;
}

export interface LocationDetails {
  schools: LocationPlace[];
  supermarkets: LocationPlace[];
  transport: LocationPlace[];
  services: LocationPlace[];
}

// FIX: Added Filters interface for property filtering to resolve import error in PropertyFilter.tsx
export interface Filters {
  location: string;
  type: 'Todos' | 'Casa' | 'Departamento' | 'Terreno';
  bedrooms: number;
  maxPrice: number;
}
