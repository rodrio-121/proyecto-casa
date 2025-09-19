import React, { useState } from 'react';
import { Property } from '../types';
import { PropertyForm } from './PropertyForm';
import { Icon } from './Icon';

interface AdminPanelProps {
  properties: Property[];
  onAddProperty: (property: Omit<Property, 'id'>) => void;
  onUpdateProperty: (property: Property) => void;
  onDeleteProperty: (id: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ properties, onAddProperty, onUpdateProperty, onDeleteProperty }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const handleOpenForm = (property: Property | null = null) => {
    setEditingProperty(property);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingProperty(null);
    setIsFormOpen(false);
  };

  const handleSave = (propertyData: Omit<Property, 'id'> & { id?: string }) => {
    if (propertyData.id) {
      onUpdateProperty(propertyData as Property);
    } else {
      const { id, ...newPropertyData } = propertyData; 
      onAddProperty(newPropertyData);
    }
    handleCloseForm();
  };
  
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestionar Propiedades</h2>
        <button
          onClick={() => handleOpenForm()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        >
          <Icon name="plus" className="w-5 h-5 mr-2" />
          Nueva Propiedad
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.map((property) => (
              <tr key={property.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{property.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${property.price.toLocaleString('es-MX')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => handleOpenForm(property)} className="text-slate-600 hover:text-slate-900"><Icon name="pencil" className="w-5 h-5 pointer-events-none"/></button>
                  <button onClick={() => onDeleteProperty(property.id)} className="text-red-600 hover:text-red-900"><Icon name="trash" className="w-5 h-5 pointer-events-none"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <PropertyForm
          property={editingProperty}
          onSave={handleSave}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
};