import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PropertyList } from './components/PropertyList';
import { PropertyModal } from './components/PropertyModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Property } from './types';
import { INITIAL_PROPERTIES } from './constants';

const App: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // States for customization
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    try {
      return localStorage.getItem('customLogo');
    } catch (error) {
      console.warn("Could not read customLogo from localStorage", error);
      return null;
    }
  });


  const handleAddProperty = useCallback((newPropertyData: Omit<Property, 'id'>) => {
    const newProperty: Property = {
        ...newPropertyData,
        id: new Date().getTime().toString(),
    };
    setProperties(prev => [newProperty, ...prev]);
  }, []);

  const handleUpdateProperty = useCallback((updatedProperty: Property) => {
    setProperties(prev => prev.map(p => p.id === updatedProperty.id ? updatedProperty : p));
  }, []);

  const handleDeleteProperty = useCallback((id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
      setProperties(prev => prev.filter(p => p.id !== id));
    }
  }, []);

  // Handlers for customization
  const handleLogoUpload = (logoDataUrl: string) => {
    try {
      localStorage.setItem('customLogo', logoDataUrl);
      setCustomLogo(logoDataUrl);
    } catch (error) {
       console.error("Could not save customLogo to localStorage", error);
       alert("No se pudo guardar el logo. Es posible que el almacenamiento del navegador esté lleno.");
    }
  };

  const handleAdminLogin = (user: string, pass: string): boolean => {
    if (user === 'Admin' && pass === 'Elgorditodema1') {
      setIsAdminMode(true);
      setIsLoginModalOpen(false);
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Header 
        isAdminMode={isAdminMode} 
        setIsAdminMode={setIsAdminMode} 
        customLogo={customLogo}
        onLogoUpload={handleLogoUpload}
      />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAdminMode ? (
          <AdminPanel 
            properties={properties}
            onAddProperty={handleAddProperty}
            onUpdateProperty={handleUpdateProperty}
            onDeleteProperty={handleDeleteProperty}
          />
        ) : (
          <>
            <PropertyList properties={properties} onSelectProperty={setSelectedProperty} />
          </>
        )}
      </main>
      <Footer onAdminLoginClick={() => setIsLoginModalOpen(true)} />
      <PropertyModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />
      {isLoginModalOpen && (
        <AdminLoginModal 
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleAdminLogin}
        />
      )}
    </div>
  );
};

export default App;