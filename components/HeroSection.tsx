import React, { useState } from 'react';
import { Icon } from './Icon';

interface HeroSectionProps {
  isAdminMode: boolean;
  title: string;
  onTitleChange: (newTitle: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isAdminMode, title, onTitleChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);

  const handleSave = () => {
    onTitleChange(draftTitle);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setDraftTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <div className="relative h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden mb-8 shadow-xl group">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="https://videos.pexels.com/video-files/8440306/8440306-hd_1920_1080_25fps.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-label="Video promocional de casas modernas"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
        {isEditing ? (
          <input
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full max-w-xl text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white text-center bg-transparent border-b-2 border-white focus:outline-none"
            autoFocus
          />
        ) : (
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white text-center drop-shadow-lg px-4">
            {title}
          </h1>
        )}
      </div>
      {isAdminMode && !isEditing && (
        <button 
          onClick={() => {
            setDraftTitle(title);
            setIsEditing(true);
          }}
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm text-slate-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-amber-500"
          aria-label="Editar título"
        >
          <Icon name="pencil" className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};