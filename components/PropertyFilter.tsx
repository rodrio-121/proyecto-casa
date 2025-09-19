
import React from 'react';
import { Filters } from '../types';
import { MAX_PRICE } from '../constants';

interface PropertyFilterProps {
  filters: Filters;
  onFilterChange: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
}

const formatPrice = (price: number) => {
  if (price >= MAX_PRICE) return `$${(MAX_PRICE / 1000000).toFixed(1)}M+`;
  if (price === 0) return 'Cualquier precio';
  return `$${(price / 1000000).toFixed(1)}M`;
}

export const PropertyFilter: React.FC<PropertyFilterProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Filter by Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
          <input
            id="location"
            type="text"
            placeholder="Buscar por ciudad o colonia..."
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="w-full pl-3 pr-3 py-2 text-base bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
          />
        </div>

        {/* Filter by Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Propiedad</label>
          <select
            id="type"
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value as Filters['type'])}
            className="w-full pl-3 pr-10 py-2 text-base bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
          >
            <option>Todos</option>
            <option>Casa</option>
            <option>Departamento</option>
            <option>Terreno</option>
          </select>
        </div>
        
        {/* Filter by Bedrooms */}
        <div>
          <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">Habitaciones (mín.)</label>
          <select
            id="bedrooms"
            value={filters.bedrooms}
            onChange={(e) => onFilterChange('bedrooms', parseInt(e.target.value, 10))}
            className="w-full pl-3 pr-10 py-2 text-base bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
          >
            <option value={0}>Cualquiera</option>
            <option value={1}>1+</option>
            <option value={2}>2+</option>
            <option value={3}>3+</option>
            <option value={4}>4+</option>
          </select>
        </div>

        {/* Filter by Price */}
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Precio Máximo: <span className="font-bold text-amber-600">{formatPrice(filters.maxPrice)}</span>
          </label>
          <input
            id="maxPrice"
            type="range"
            min="0"
            max={MAX_PRICE}
            step="500000"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange('maxPrice', parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
        </div>
      </div>
    </div>
  );
};
