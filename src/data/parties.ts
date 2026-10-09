export type Year = 2023 | 2026;

export type Programme = {
  title: string;
  url: string;
  language: string;
  note?: string;
};

export type Party = {
  slug: string;
  name: string;
  short: string;
  color: string;
  logo: string;
  scope: string;
  aliases: string[];
  tagline: string;
  points: { label: string; text: string }[];
  programmes: Partial<Record<Year, Programme>>;
};

export const YEARS: Year[] = [2023, 2026];

export const parties: Party[] = [
  {
    slug: "psoe",
    name: "Partido Socialista Obrero Español",
    short: "PSOE",
    color: "#E30613",
    logo: "/logos/psoe.svg",
    scope: "Toda España",
    aliases: ["psoe", "socialista", "socialistas", "sanchez", "pedro sanchez"],
    tagline: "Seguir con lo que ya han hecho en el Gobierno y apretar un poco más.",
    points: [
      { label: "Vivienda", text: "Topes al alquiler en zonas tensionadas y avales para jóvenes." },
      { label: "Trabajo", text: "Mantener la reforma laboral y seguir subiendo el salario mínimo." },
      { label: "Impuestos", text: "Que paguen más la banca, las energéticas y las grandes fortunas." },
      { label: "Sanidad", text: "Más medios para la sanidad pública y la atención primaria." },
      { label: "Inmigración", text: "Integración con derechos y también con obligaciones." },
    ],
    programmes: {
      2023: {
        title: "España avanza",
        url: "https://www.psoe.es/media-content/2023/07/PROGRAMA_ELECTORAL-GENERALES-2023.pdf",
        language: "Castellano",
      },
    },
  },
  {
    slug: "pp",
    name: "Partido Popular",
    short: "PP",
    color: "#1D84CE",
    logo: "/logos/pp.svg",
    scope: "Toda España",
    aliases: ["pp", "partido popular", "populares", "feijoo"],
    tagline: "Bajar impuestos, menos papeleo y dar la vuelta a lo que ha hecho el Gobierno de Sánchez.",
    points: [
      { label: "Vivienda", text: "Derogar la ley de vivienda y liberar suelo para construir." },
      { label: "Trabajo", text: "Menos trabas a autónomos y empresas." },
      { label: "Impuestos", text: "Bajar el IRPF a las rentas medias y bajas." },
      { label: "Sanidad", text: "Un plan para recortar las listas de espera." },
      { label: "Seguridad", text: "Más policía y videovigilancia en los puntos conflictivos." },
    ],
    programmes: {
      2023: {
        title: "Programa electoral 23J · 365 medidas",
        url: "https://www.pp.es/wp-content/uploads/2023/07/programa_electoral_pp_23j_feijoo_2023.pdf",
        language: "Castellano",
      },
    },
  },
  {
    slug: "vox",
    name: "VOX",
    short: "Vox",
    color: "#5AC035",
    logo: "/logos/vox.svg",
    scope: "Toda España",
    aliases: ["vox", "abascal"],
    tagline: "España primero: mano dura con la inmigración ilegal y con el independentismo.",
    points: [
      { label: "Vivienda", text: "Menos impuestos para comprar tu primera casa." },
      { label: "Trabajo", text: "Subir sueldos bajando impuestos y cotizaciones." },
      { label: "Impuestos", text: "Bajada fuerte y fuera el impuesto de sucesiones." },
      { label: "Inmigración", text: "Deportar a los ilegales y consultar al pueblo el modelo." },
      { label: "España", text: "Volver a castigar el referéndum ilegal y la sedición." },
    ],
    programmes: {
      2023: {
        title: "Un programa para lo que importa",
        url: "https://static.eldiario.es/eldiario/public/content/file/original/2023/0707/14/programa-vox-06-07-23-2-pdf.pdf",
        language: "Castellano",
        note: "Copia publicada por elDiario.es; la web de VOX no deja descargar el PDF.",
      },
    },
  },
  {
    slug: "sumar",
    name: "Sumar",
    short: "Sumar",
    color: "#E51C55",
    logo: "/logos/sumar.svg",
    scope: "Toda España",
    aliases: ["sumar", "yolanda", "yolanda diaz"],
    tagline: "Más derechos para la gente currante y un Estado del bienestar más grande.",
    points: [
      { label: "Vivienda", text: "Precios de referencia para el alquiler." },
      { label: "Trabajo", text: "Jornada más corta sin bajar el sueldo." },
      { label: "Impuestos", text: "Más impuestos a las grandes fortunas." },
      { label: "Sanidad", text: "Medio punto más del PIB cada año para la sanidad pública." },
      { label: "Territorio", text: "Mesa de diálogo entre el Gobierno y la Generalitat." },
    ],
    programmes: {
      2023: {
        title: "Un programa para ti",
        url: "https://movimientosumar.es/wp-content/uploads/2023/07/Un-Programa-para-ti.pdf",
        language: "Castellano",
      },
    },
  },
  {
    slug: "erc",
    name: "Esquerra Republicana de Catalunya",
    short: "ERC",
    color: "#F5A400",
    logo: "/logos/erc.svg",
    scope: "Cataluña",
    aliases: ["erc", "esquerra", "rufian"],
    tagline: "Que Cataluña decida su futuro y, mientras tanto, más derechos sociales.",
    points: [
      { label: "Vivienda", text: "Que Cataluña regule el alquiler, precios incluidos." },
      { label: "Trabajo", text: "Mismas condiciones para los trabajadores de subcontratas." },
      { label: "Impuestos", text: "Mínimo del 15% de sociedades para las grandes empresas." },
      { label: "Inmigración", text: "Acabar con la externalización de fronteras." },
      { label: "Cataluña", text: "Referéndum de autodeterminación." },
    ],
    programmes: {
      2023: {
        title: "Programa electoral Eleccions Generals 2023",
        url: "https://www.elnacional.cat/uploads/s1/42/77/21/88/programa-electoral-erc-eleccions-generals-2023-gabriel-rufian.pdf",
        language: "Catalán",
        note: "Copia publicada por elNacional.cat.",
      },
    },
  },
  {
    slug: "junts",
    name: "Junts per Catalunya",
    short: "Junts",
    color: "#20C0B2",
    logo: "/logos/junts.svg",
    scope: "Cataluña",
    aliases: ["junts", "puigdemont", "nogueras"],
    tagline: "Cataluña primero: más poder para la Generalitat y el camino hacia la independencia.",
    points: [
      { label: "Vivienda", text: "Fondos de vivienda y pisos de la SAREB para la Generalitat." },
      { label: "Trabajo", text: "Un salario mínimo catalán de 1.319 €." },
      { label: "Impuestos", text: "Menos presión fiscal a las empresas catalanas." },
      { label: "Cataluña", text: "Más autogobierno y autodeterminación." },
    ],
    programmes: {
      2023: {
        title: "Programa electoral Eleccions Generals 2023",
        url: "https://img.beteve.cat/wp-content/uploads/2023/07/programa-junts-per-catalunya-eleccions-generals-2023.pdf",
        language: "Catalán",
        note: "Copia publicada por betevé.",
      },
    },
  },
  {
    slug: "pnv",
    name: "Partido Nacionalista Vasco (EAJ-PNV)",
    short: "PNV",
    color: "#008D36",
    logo: "/logos/pnv.svg",
    scope: "Euskadi",
    aliases: ["pnv", "eaj", "peneuve", "partido nacionalista vasco"],
    tagline: "Defender Euskadi y su autogobierno, pactando con quien haga falta.",
    points: [
      { label: "Vivienda", text: "Ayudar a los jóvenes a emanciparse." },
      { label: "Impuestos", text: "Que Euskadi y Navarra decidan sus propios impuestos." },
      { label: "Inmigración", text: "Una política europea común de inmigración y asilo." },
      { label: "Euskadi", text: "Cumplir entero el Estatuto de Gernika." },
    ],
    programmes: {
      2023: {
        title: "Programa electoral 23J",
        url: "https://www.newtral.es/wp-content/uploads/2023/07/Programa-electoral-PNV-23j-2023.pdf",
        language: "Castellano",
        note: "Copia publicada por Newtral.",
      },
    },
  },
  {
    slug: "bildu",
    name: "Euskal Herria Bildu",
    short: "EH Bildu",
    color: "#7DB400",
    logo: "/logos/bildu.svg",
    scope: "Euskadi y Navarra",
    aliases: ["bildu", "eh bildu", "otegi", "aizpurua"],
    tagline: "Izquierda vasca: derechos sociales a tope y que Euskal Herria pueda decidir.",
    points: [
      { label: "Vivienda", text: "Prórroga automática de los alquileres, sin subida." },
      { label: "Impuestos", text: "Impuestos fijos a banca, energéticas y grandes fortunas." },
      { label: "Sanidad", text: "Más plazas MIR y más atención primaria." },
      { label: "Inmigración", text: "Fin de las devoluciones en caliente." },
      { label: "Euskal Herria", text: "Derecho a decidir." },
    ],
    programmes: {
      2023: {
        title: "Compromiso de Euskal Herria Bildu",
        url: "https://www.newtral.es/wp-content/uploads/2023/07/Programa-electoral-EHBildu-23j-2023.pdf",
        language: "Castellano",
        note: "Copia publicada por Newtral.",
      },
    },
  },
  {
    slug: "bng",
    name: "Bloque Nacionalista Galego",
    short: "BNG",
    color: "#76B6E4",
    logo: "/logos/bng.png",
    scope: "Galicia",
    aliases: ["bng", "bloque nacionalista galego", "ponton"],
    tagline: "Que Galiza cuente: más poder para Galicia y más justicia social.",
    points: [
      { label: "Vivienda", text: "Recargo en el IBI a los pisos vacíos." },
      { label: "Trabajo", text: "Convenios laborales propios de Galicia." },
      { label: "Impuestos", text: "Que Galicia recaude todos sus impuestos." },
      { label: "Inmigración", text: "Regularización y más medios en extranjería." },
      { label: "Galicia", text: "Derecho de autodeterminación." },
    ],
    programmes: {
      2023: {
        title: "Que Galiza conte! Con máis forza!",
        url: "https://www.bng.gal/media/bnggaliza/files/2023/07/05/23_bng_xerais_programa.pdf",
        language: "Gallego",
      },
    },
  },
  {
    slug: "cc",
    name: "Coalición Canaria",
    short: "CC",
    color: "#F2C500",
    logo: "/logos/cc.svg",
    scope: "Canarias",
    aliases: ["coalicion canaria"],
    tagline: "Defender Canarias en Madrid: agenda canaria, REF y archipiélago.",
    points: [],
    programmes: {},
  },
  {
    slug: "upn",
    name: "Unión del Pueblo Navarro",
    short: "UPN",
    color: "#2A52BE",
    logo: "/logos/upn.svg",
    scope: "Navarra",
    aliases: ["upn", "union del pueblo navarro"],
    tagline: "Navarra foral, distinta pero dentro de España.",
    points: [
      { label: "Vivienda", text: "Derogar la ley de vivienda y frenar la okupación." },
      { label: "Sanidad", text: "Sanidad de calidad y apoyo a la familia." },
      { label: "Navarra", text: "Quitar la Transitoria Cuarta de la Constitución." },
    ],
    programmes: {
      2023: {
        title: "Programa Elecciones Generales 23J",
        url: "https://www.upn.org/wp-content/uploads/2023/07/Programa-Generales-23J_V2-1.pdf",
        language: "Castellano",
      },
    },
  },
  {
    slug: "pacma",
    name: "Partido Animalista con el Medio Ambiente",
    short: "PACMA",
    color: "#8DC63F",
    logo: "/logos/pacma.svg",
    scope: "Toda España",
    aliases: ["pacma", "animalista", "animalistas"],
    tagline: "Los animales y el planeta también cuentan.",
    points: [
      { label: "Vivienda", text: "Frenar los pisos turísticos." },
      { label: "Impuestos", text: "Ir a por el fraude fiscal, que supone el 6% del PIB." },
      { label: "Sanidad", text: "Revertir las privatizaciones y reforzar la primaria." },
      { label: "Animales", text: "Más protección legal y una fiscalía especializada." },
    ],
    programmes: {
      2023: {
        title: "Programa electoral Generales 23J",
        url: "https://www.pacma.es/wp-content/uploads/2023/07/PACMA_PE_GENERALES_23J23.pdf",
        language: "Castellano",
      },
    },
  },
  {
    slug: "cup",
    name: "Candidatura d'Unitat Popular",
    short: "CUP",
    color: "#E6C800",
    logo: "/logos/cup.svg",
    scope: "Cataluña",
    aliases: ["cup", "candidatura d'unitat popular", "botran"],
    tagline: "Independencia, anticapitalismo y feminismo, sin medias tintas.",
    points: [
      { label: "Servicios", text: "Sanidad y educación 100% públicas." },
      { label: "Derechos", text: "Políticas feministas y contra las violencias machistas." },
      { label: "Cataluña", text: "Independencia y autodeterminación." },
    ],
    programmes: {
      2023: {
        title: "Programa Eleccions Generals 2023",
        url: "https://www.elnacional.cat/uploads/s1/42/79/67/70/programa-electoral-cup-2023-eleccions-generals-albert-botran.pdf",
        language: "Catalán",
        note: "Copia publicada por elNacional.cat.",
      },
    },
  },
];

export const partyBySlug = Object.fromEntries(parties.map((p) => [p.slug, p])) as Record<string, Party>;
