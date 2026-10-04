export interface Event {
  slug: "family" | "friends";
  dateTime: string;
  timeLabel: string;
  venueName: string;
  address: string[];
  mapEmbedUrl?: string;
  hasMenu: boolean;
  hasDisclaimer: boolean;
  dressCodeText?: string;
}

export const events: Event[] = [
  {
    slug: "family",
    dateTime: "2026-10-10T17:00:00-04:00",
    timeLabel: "5:00 p. m. – 10:00 p. m.",
    venueName: "Casa de Judith",
    address: ["Conjunto Residencial Bahía Del Lago, Villa 1.", "casa 15"],
    mapEmbedUrl: "https://snazzymaps.com/embed/813005",
    hasMenu: false,
    hasDisclaimer: true,
    dressCodeText:
      "La celebración será de etiqueta formal/semi formal. Te pedimos vestir dentro de la siguiente paleta de colores para mantener la armonía del evento.",
  },
  {
    slug: "friends",
    dateTime: "2026-10-11T18:00:00-04:00",
    timeLabel: "6:00 p. m. – 8:00 p. m.",
    venueName: "Aliño Restaurante",
    address: ["Av. Fuerzas Armadas, Padel, Maracaibo"],
    hasMenu: true,
    hasDisclaimer: false,
    dressCodeText:
      "La celebración será de etiqueta semi formal. Te pedimos vestir dentro de la siguiente paleta de colores para mantener la armonía del evento.",
  },
];
