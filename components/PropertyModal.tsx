import React, { useEffect, useState, useCallback } from 'react';
import { Property, LocationDetails, LocationPlace } from '../types';
import { fetchLocationDetails } from '../services/geminiService';
import { Icon } from './Icon';
import { Map } from './Map';
import { Spinner } from './Spinner';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
  }).format(value);
};

const Feature: React.FC<{ icon: 'bed' | 'bath' | 'area'; value: React.ReactNode; label: string }> = ({ icon, value, label }) => (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col items-center justify-center text-center">
        <Icon name={icon} className="w-8 h-8 text-slate-700 mb-2" />
        <p className="text-lg font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
    </div>
);

const LocationDetailSection: React.FC<{ title: string; icon: 'school' | 'store' | 'bus' | 'sparkles'; items: LocationPlace[] }> = ({ title, icon, items }) => (
  <div>
    <h4 className="text-lg font-semibold text-gray-800 flex items-center mb-2">
      <Icon name={icon} className="w-5 h-5 mr-3 text-slate-700" />
      {title}
    </h4>
    {items.length > 0 ? (
      <ul className="list-disc list-inside text-gray-600 space-y-1">
        {items.map((item, index) => <li key={index}>{item.name} <span className="text-gray-500 text-sm">({item.time})</span></li>)}
      </ul>
    ) : (
      <p className="text-gray-500 italic">No se encontró información.</p>
    )}
  </div>
);

interface PropertyModalProps {
  property: Property | null;
  onClose: () => void;
}

export const PropertyModal: React.FC<PropertyModalProps> = ({ property, onClose }) => {
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (property) {
      const getDetails = async () => {
        setIsLoadingDetails(true);
        setError(null);
        setLocationDetails(null);
        try {
          const details = await fetchLocationDetails(property.location);
          setLocationDetails(details);
        } catch (err) {
          setError('No se pudieron cargar los detalles de la ubicación.');
          console.error(err);
        } finally {
          setIsLoadingDetails(false);
        }
      };
      getDetails();
    }
  }, [property]);
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
       if (event.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else {
          onClose();
        }
       }
    };
    if (property) {
        document.body.style.overflow = 'hidden';
        setCurrentImageIndex(0);
        window.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [property, onClose, isLightboxOpen]);

  const nextImage = useCallback(() => {
    if (!property || property.photos.length === 0) return;
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % property.photos.length);
  }, [property]);

  const prevImage = useCallback(() => {
    if (!property || property.photos.length === 0) return;
    setCurrentImageIndex(prevIndex => (prevIndex - 1 + property.photos.length) % property.photos.length);
  }, [property]);

  if (!property) return null;

  const Lightbox = () => (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4" onClick={() => setIsLightboxOpen(false)} role="dialog" aria-modal="true">
      <button onClick={() => setIsLightboxOpen(false)} aria-label="Cerrar vista ampliada" className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/75 transition-colors">
        <Icon name="x-mark" className="w-6 h-6" />
      </button>
      
      <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
        {property.photos.length > 1 && (
          <>
            <button onClick={prevImage} aria-label="Foto anterior" className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/75 transition-colors z-10">
              <Icon name="chevron-left" className="w-8 h-8" />
            </button>
            <button onClick={nextImage} aria-label="Siguiente foto" className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/75 transition-colors z-10">
              <Icon name="chevron-right" className="w-8 h-8" />
            </button>
          </>
        )}
  
        <img
          src={property.photos[currentImageIndex]}
          alt={`${property.title} - Foto ampliada ${currentImageIndex + 1}`}
          className="max-w-full max-h-full object-contain select-none"
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="property-title">
        {isLightboxOpen && <Lightbox />}
        
        <button onClick={onClose} aria-label="Cerrar" className="absolute top-4 right-4 z-30 bg-white/80 backdrop-blur-sm rounded-full p-2 text-slate-800 hover:bg-white/100 shadow-lg transition-colors">
            <Icon name="x-mark" className="w-6 h-6" />
        </button>

        <div className="w-full max-w-4xl mx-auto">
            <div className="p-6 md:p-10 space-y-8">
                <header>
                    <p className="text-sm font-semibold text-amber-600 uppercase tracking-wider">{property.type}</p>
                    <h2 id="property-title" className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mt-1">{property.title}</h2>
                    <p className="mt-2 text-lg text-gray-500 flex items-center">
                    <Icon name="map-pin" className="w-5 h-5 mr-2 text-gray-400" />
                    {property.location}, {property.zipCode}
                    </p>
                </header>

                <section>
                    <h3 className="sr-only">Galería de Fotos</h3>
                    {property.photos.length > 0 ? (
                        <div className="relative group rounded-lg overflow-hidden shadow-md">
                        <img
                            src={property.photos[currentImageIndex]}
                            alt={`${property.title} - Foto ${currentImageIndex + 1}`}
                            className="w-full h-96 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                            onClick={() => setIsLightboxOpen(true)}
                        />
                        {property.photos.length > 1 && (
                            <>
                            <button onClick={prevImage} aria-label="Foto anterior" className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/75 transition-colors opacity-0 group-hover:opacity-100">
                                <Icon name="chevron-left" className="w-6 h-6" />
                            </button>
                            <button onClick={nextImage} aria-label="Siguiente foto" className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/75 transition-colors opacity-0 group-hover:opacity-100">
                                <Icon name="chevron-right" className="w-6 h-6" />
                            </button>
                            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-sm px-2 py-1 rounded-md">
                                {currentImageIndex + 1} / {property.photos.length}
                            </div>
                            </>
                        )}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-gray-100 rounded-lg border">
                        <Icon name="logo" className="w-12 h-12 mx-auto text-gray-400" />
                        <p className="mt-2 text-gray-500">No hay fotos disponibles</p>
                        </div>
                    )}
                </section>

                <section className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                    <p className="text-gray-600">Precio de la propiedad</p>
                    <p className="text-4xl font-extrabold text-slate-800 my-2">{formatCurrency(property.price)}</p>
                    <p className="text-sm text-gray-500 mb-4">Listo para escriturar y entrega inmediata.</p>
                    <a href={`https://wa.me/5215512345678?text=Hola, me interesa la propiedad '${property.title}' ubicada en ${property.location}.`} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center px-6 py-3 border-2 border-slate-800 text-base font-bold rounded-md shadow-sm text-slate-800 bg-white hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 transition-colors">
                        CONTÁCTANOS
                    </a>
                </section>

                <section className="bg-gray-50 p-6 rounded-lg shadow-sm border">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Características Principales</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {property.type !== 'Terreno' && (
                        <>
                            <Feature icon="bed" value={property.bedrooms} label="Habitaciones" />
                            <Feature icon="bath" value={property.bathrooms} label="Baños" />
                        </>
                        )}
                        <Feature icon="area" value={<>{property.squareMeters} m<sup>2</sup></>} label="Superficie" />
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Descripción de la Propiedad</h3>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{property.description}</p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Ubicación</h3>
                    <Map location={property.location} zipCode={property.zipCode} />
                </section>
                
                {property.nearbyPlaces && property.nearbyPlaces.length > 0 && (
                <section>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                        <Icon name="nearby" className="w-6 h-6 mr-2 text-slate-700" />
                        Puntos de Interés
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 bg-gray-50 p-4 rounded-md border">
                        {property.nearbyPlaces.map((place, index) => <li key={index}>{place}</li>)}
                    </ul>
                </section>
                )}

                <section>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                        <Icon name="sparkles" className="w-6 h-6 mr-2 text-yellow-500" />
                        Análisis del Entorno
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md border">
                        {isLoadingDetails && <Spinner />}
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {locationDetails && (
                        <div className="space-y-4">
                            <LocationDetailSection title="Escuelas" icon="school" items={locationDetails.schools} />
                            <LocationDetailSection title="Supermercados" icon="store" items={locationDetails.supermarkets} />
                            <LocationDetailSection title="Transporte" icon="bus" items={locationDetails.transport} />
                            <LocationDetailSection title="Servicios" icon="sparkles" items={locationDetails.services} />
                        </div>
                        )}
                    </div>
                </section>
            </div>
        
            <footer className="bg-slate-800 text-white mt-auto py-8">
                <div className="max-w-7xl mx-auto px-8 text-center">
                    <p>&copy; {new Date().getFullYear()} Vía Hogar. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    </div>
  );
};