
import React from 'react';

interface MapProps {
  location: string;
  zipCode: string;
}

export const Map: React.FC<MapProps> = ({ location, zipCode }) => {
  const mapQuery = encodeURIComponent(`${location}, ${zipCode}`);
  const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-md border">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={mapSrc}
        title={`Mapa de ${location}`}
        aria-label={`Mapa de ${location}`}
      ></iframe>
    </div>
  );
};