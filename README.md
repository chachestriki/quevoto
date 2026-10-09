# quevoto?

Los programas electorales de los partidos españoles, contados en cristiano. Una landing con un resumen de cada partido y, abajo, un chat que responde a partir de lo que pone en los programas y cita el partido y la página.

## Cómo funciona

- `data/pdfs/<año>/<partido>.pdf`: los programas en PDF. No van al repo; las URLs están en `src/data/parties.ts`.
- `scripts/ingest.mjs` saca el texto de cada página, lo trocea y genera `data/index/<año>.json`. Este índice sí se sube al repo.
- `src/lib/search.ts`: búsqueda BM25 sobre los trozos, con sinónimos en castellano, catalán y gallego y filtro por partido cuando la pregunta lo menciona.
- `src/app/api/chat/route.ts`: recupera los mejores trozos y llama a OpenAI (`OPENAI_MODEL`, por defecto `gpt-4o-mini`) para responder citando `[n]`. Sin `OPENAI_API_KEY`, devuelve los fragmentos tal cual.

## Añadir los programas de 2026

1. Mete los PDFs en `data/pdfs/2026/<slug>.pdf` (usa los mismos slugs de `src/data/parties.ts`, por ejemplo `psoe.pdf` o `pp.pdf`).
2. Ejecuta `npm run ingest -- 2026`.
3. En `src/data/parties.ts`, añade `programmes[2026]` a cada partido con su título y URL, y actualiza los resúmenes.
4. El chat usa automáticamente el año más reciente que tenga índice.

## Desarrollo

```bash
npm install
cp .env.example .env.local   # pon tu OPENAI_API_KEY
npm run dev
```

## Despliegue

Importa el repo en Vercel y añade `OPENAI_API_KEY` en las variables de entorno. `OPENAI_MODEL` es opcional.

## Licencia

Código bajo licencia [MIT](LICENSE). Los programas electorales y los logos pertenecen a sus respectivos partidos; los logos vienen de Wikimedia Commons.
