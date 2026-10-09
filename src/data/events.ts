export interface Event {
  slug: "family" | "friends";
  dateTime: string;
  timeLabel: string;
  venueName: string;
  address: string[];
  mapEmbedUrl: string;
  googleMapsLink: string;
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
    googleMapsLink: "https://www.google.com/maps/place/Conjunto+Residencial+Bah%C3%ADa+Del+Lago,+Villa+1.,+C.+14,+Maracaibo+4002,+Zulia/@10.7227117,-71.6189534,18z/data=!3m1!4b1!4m6!3m5!1s0x8e899f1d17b7cfb9:0x248b995fdef8b596!8m2!3d10.7226774!4d-71.6178289!16s%2Fg%2F11b8tfljgw?entry=ttu&g_ep=EgoyMDI2MDkzMC4wIKXMDSoASAFQAw%3D%3D",
    hasMenu: false,
    hasDisclaimer: true,
    dressCodeText:
      "La celebración será de etiqueta formal/semi formal. Te pedimos vestir dentro de la siguiente paleta de colores para mantener la armonía del evento.",
  },
  {
    slug: "friends",
    dateTime: "2026-10-17T18:00:00-04:00",
    timeLabel: "6:00 p. m. – 8:00 p. m.",
    venueName: "Aliño Restaurante",
    address: ["Av. Fuerzas Armadas, Padel, Maracaibo"],
    mapEmbedUrl: "https://snazzymaps.com/embed/815160",
    googleMapsLink: "https://www.google.com/maps/place/Ali%C3%B1o+Restaurante/@10.703827,-71.6254287,19z/data=!4m6!3m5!1s0x8e899f0a32c3759f:0x4209f396a2be817c!8m2!3d10.7039133!4d-71.6249973!16s%2Fg%2F11y0sj29h4?entry=ttu&g_ep=EgoyMDI2MDkzMC4wIKXMDSoASAFQAw%3D%3D",
    hasMenu: true,
    hasDisclaimer: false,
    dressCodeText:
      "La celebración será de etiqueta semi formal. Te pedimos vestir dentro de la siguiente paleta de colores para mantener la armonía del evento.",
  },
];
