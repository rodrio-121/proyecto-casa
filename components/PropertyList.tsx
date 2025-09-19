
import React from 'react';
import { Property } from '../types';
import { PropertyCard } from './PropertyCard';

interface PropertyListProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

export const PropertyList: React.FC<PropertyListProps> = ({ properties, onSelectProperty }) => {
  if (properties.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <h2 className="text-2xl font-semibold text-gray-700">No se encontraron propiedades</h2>
        <p className="text-gray-500 mt-2">Intenta ajustar los filtros para encontrar tu hogar ideal.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {properties.map(property => (
        <PropertyCard key={property.id} property={property} onSelect={onSelectProperty} />
      ))}
    </div>
  );
};
