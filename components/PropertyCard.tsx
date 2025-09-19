import React from 'react';
import { Property } from '../types';
import { Icon } from './Icon';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
  }).format(value);
};

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer group"
      onClick={() => onSelect(property)}
    >
      <div className="relative">
        <img className="w-full h-56 object-cover" src={property.photos[0]} alt={property.title} />
        <div className="absolute top-2 left-2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded">{property.type}</div>
         <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
      </div>
      <div className="p-4 sm:p-6">
        <h3 className="text-xl font-semibold text-gray-800 truncate">{property.title}</h3>
        <p className="text-sm text-gray-500 flex items-center mt-1">
          <Icon name="map-pin" className="w-4 h-4 mr-1.5 text-gray-400" />
          {property.location}
        </p>
        <p className="text-2xl font-bold text-slate-800 my-3">{formatCurrency(property.price)}</p>
        <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-3">
          {property.type !== 'Terreno' ? (
            <>
              <span className="flex items-center">
                <Icon name="bed" className="w-5 h-5 mr-2 text-slate-600" />
                {property.bedrooms} hab.
              </span>
              <span className="flex items-center">
                <Icon name="bath" className="w-5 h-5 mr-2 text-slate-600" />
                {property.bathrooms} baños
              </span>
            </>
          ) : (
             <span className="flex items-center"></span>
          )}
          <span className="flex items-center">
            <Icon name="area" className="w-5 h-5 mr-2 text-slate-600" />
            {property.squareMeters} m²
          </span>
        </div>
      </div>
    </div>
  );
};