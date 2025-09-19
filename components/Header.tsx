import React, { useRef } from 'react';
import { Icon } from './Icon';

interface HeaderProps {
  isAdminMode: boolean;
  setIsAdminMode: (isAdmin: boolean) => void;
  customLogo: string | null;
  onLogoUpload: (logoDataUrl: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ isAdminMode, setIsAdminMode, customLogo, onLogoUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoClick = () => {
    if (isAdminMode) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onLogoUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
           <div
              className={`relative group ${isAdminMode ? 'cursor-pointer' : ''}`}
              onClick={handleLogoClick}
              title={isAdminMode ? "Haz clic para cambiar el logo" : ""}
              aria-label={isAdminMode ? "Cambiar logo" : "Logo de Vía Hogar"}
              role={isAdminMode ? "button" : "img"}
              tabIndex={isAdminMode ? 0 : -1}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleLogoClick(); }}
           >
              {customLogo ? (
                <img src={customLogo} alt="Logo personalizado" className="w-12 h-12 object-contain" />
              ) : (
                <Icon name="logo" className="w-12 h-12 text-slate-800"/>
              )}
             {isAdminMode && (
               <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                 <Icon name="pencil" className="w-5 h-5 text-white" />
               </div>
             )}
           </div>
          <h1 className="text-3xl font-bold text-gray-800">Vía Hogar</h1>
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/svg+xml, image/gif"
            className="hidden"
            aria-hidden="true"
          />
        </div>
        <div className="flex items-center space-x-3">
          {isAdminMode && (
            <button
              onClick={() => setIsAdminMode(false)}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Salir
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
