
import React, { useState, useEffect } from 'react';
import { Property } from '../types';
import { Icon } from './Icon';

interface PropertyFormProps {
  property: Property | null;
  onSave: (property: Omit<Property, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}

const emptyProperty: Omit<Property, 'id'> = {
  title: '',
  type: 'Casa',
  price: 0,
  bedrooms: 0,
  bathrooms: 0,
  squareMeters: 0,
  description: '',
  location: '',
  zipCode: '',
  photos: [],
  nearbyPlaces: [],
};

export const PropertyForm: React.FC<PropertyFormProps> = ({ property, onSave, onCancel }) => {
  const [formData, setFormData] = useState(emptyProperty);
  const [nearbyPlaceInput, setNearbyPlaceInput] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (property) {
      setFormData({
        ...emptyProperty,
        ...property
      });
    } else {
      setFormData(emptyProperty);
    }
  }, [property]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'bedrooms' || name === 'bathrooms' || name === 'squareMeters' ? Number(value) : value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const filesArray = Array.from(e.target.files);
        filesArray.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, photos: [...prev.photos, reader.result as string] }));
            };
            reader.readAsDataURL(file);
        });
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => ({
        ...prev,
        photos: prev.photos.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleAddNearbyPlace = () => {
    if (nearbyPlaceInput.trim()) {
        setFormData(prev => ({
            ...prev,
            nearbyPlaces: [...prev.nearbyPlaces, nearbyPlaceInput.trim()],
        }));
        setNearbyPlaceInput('');
    }
  };

  const handleRemoveNearbyPlace = (indexToRemove: number) => {
    setFormData(prev => ({
        ...prev,
        nearbyPlaces: prev.nearbyPlaces.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newPhotos = [...formData.photos];
    const draggedPhoto = newPhotos.splice(draggedIndex, 1)[0];
    newPhotos.splice(dropIndex, 0, draggedPhoto);

    setFormData(prev => ({ ...prev, photos: newPhotos }));
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: property?.id });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{property ? 'Editar Propiedad' : 'Nueva Propiedad'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full bg-white text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500" required />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo</label>
                <select name="type" id="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full bg-white text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500">
                  <option>Casa</option>
                  <option>Departamento</option>
                  <option>Terreno</option>
                </select>
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio (MXN)</label>
                <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full bg-white text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500" required />
              </div>
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Habitaciones</label>
                <input type="number" name="bedrooms" id="bedrooms" value={formData.bedrooms} onChange={handleChange} className="mt-1 block w-full bg-white text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500" />
              </div>
              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Baños</label>
                <input type="number" name="bathrooms" id="bathrooms" value={formData.bathrooms} onChange={handleChange} className="mt-1 block w-full bg-white text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500" />
              </div>
              <div>
                <label htmlFor="squareMeters" className="block text-sm font-medium text-gray-700">Metros Cuadrados (m²)</label>
                <input type="number" name="squareMeters" id="squareMeters" value={formData.squareMeters} onChange={handleChange} className="mt-1 block w-full bg-white text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500" required />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Ubicación (e.g., Polanco)</label>
                <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full bg-white text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500" required />
              </div>
               <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Código Postal</label>
                <input type="text" name="zipCode" id="zipCode" value={formData.zipCode} onChange={handleChange} className="mt-1 block w-full bg-white text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500" required />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full bg-white text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500" required />
              </div>

               {/* Photos Section */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Fotos</label>
                    <div className="mt-2 flex items-center flex-wrap gap-4 p-4 border-2 border-dashed border-gray-300 rounded-md min-h-[128px]">
                        {formData.photos.map((photo, index) => (
                            <div 
                                key={`${index}-${photo.slice(-10)}`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                onDragEnd={handleDragEnd}
                                className={`relative group cursor-grab transition-opacity ${draggedIndex === index ? 'opacity-30' : 'opacity-100'}`}
                            >
                                <div className="absolute top-1 left-1 bg-black/60 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <Icon name="drag-handle" className="w-4 h-4" />
                                </div>
                                <img src={photo} alt={`Preview ${index + 1}`} className="h-24 w-24 rounded-md object-cover pointer-events-none" />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-0.5 flex items-center justify-center shadow-md"
                                >
                                    <Icon name="x-mark" className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center justify-center h-24 w-24 bg-gray-50 rounded-md border border-gray-300 hover:bg-gray-100 text-gray-500">
                            <Icon name="plus" className="w-8 h-8 text-gray-400" />
                            <span className="text-xs mt-1">Añadir foto</span>
                            <input id="photo-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleImageChange} />
                        </label>
                    </div>
                </div>

                {/* Nearby Places Section */}
                <div className="md:col-span-2">
                    <label htmlFor="nearbyPlaceInput" className="block text-sm font-medium text-gray-700">Lugares Cercanos</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                            type="text"
                            id="nearbyPlaceInput"
                            value={nearbyPlaceInput}
                            onChange={(e) => setNearbyPlaceInput(e.target.value)}
                            onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddNearbyPlace(); }}}
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md bg-white text-gray-900 focus:ring-amber-500 focus:border-amber-500 border-gray-300"
                            placeholder="Ej: Parada de Va y Ven"
                        />
                        <button
                            type="button"
                            onClick={handleAddNearbyPlace}
                            className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-sm font-medium text-gray-700 rounded-r-md hover:bg-gray-100"
                        >
                            Agregar
                        </button>
                    </div>
                     <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                        {formData.nearbyPlaces.map((place, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                                <span className="text-sm text-gray-800">{place}</span>
                                <button type="button" onClick={() => handleRemoveNearbyPlace(index)} className="text-red-500 hover:text-red-700">
                                    <Icon name="trash" className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
            <button type="button" onClick={onCancel} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
              Cancelar
            </button>
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
              Guardar Propiedad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
