
import { GoogleGenAI, Type } from "@google/genai";
import { LocationDetails } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const placeSchema = {
    type: Type.OBJECT,
    properties: {
        name: {
            type: Type.STRING,
            description: 'Nombre del lugar.'
        },
        time: {
            type: Type.STRING,
            description: 'Tiempo estimado de viaje (ej. "5 min en coche").'
        }
    },
    required: ['name', 'time']
};


export const fetchLocationDetails = async (location: string): Promise<LocationDetails | null> => {
  const prompt = `
    Proporciona un resumen de los servicios y amenidades alrededor de la ubicación: "${location}".
    Enumera específicamente escuelas, supermercados, opciones de transporte público y otros servicios importantes cercanos.
    Para cada lugar, proporciona el nombre y un tiempo de viaje estimado (ej. "5 min en coche", "10 min caminando").
    Formatea la salida como un objeto JSON con las siguientes claves: 'schools', 'supermarkets', 'transport', 'services'.
    Cada clave debe contener un array de objetos, donde cada objeto tiene las claves 'name' y 'time'. Si no encuentras información para una categoría, devuelve un array vacío.
    No incluyas markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            schools: {
              type: Type.ARRAY,
              items: placeSchema,
              description: 'Escuelas cercanas con tiempos de viaje.'
            },
            supermarkets: {
              type: Type.ARRAY,
              items: placeSchema,
              description: 'Supermercados cercanos con tiempos de viaje.'
            },
            transport: {
              type: Type.ARRAY,
              items: placeSchema,
              description: 'Opciones de transporte público con tiempos de viaje.'
            },
            services: {
              type: Type.ARRAY,
              items: placeSchema,
              description: 'Otros servicios importantes con tiempos de viaje.'
            }
          }
        }
      },
    });

    const jsonString = response.text;
    const details = JSON.parse(jsonString);
    return details;

  } catch (error) {
    console.error("Error fetching location details from Gemini API:", error);
    return null;
  }
};
