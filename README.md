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

## Límites y seguridad

Para que nadie te funda los créditos de OpenAI:

- Límite por IP: `RATE_LIMIT_HOUR` (10) y `RATE_LIMIT_DAY` (30). Si se pasa, devuelve 429.
- Tope global: `GLOBAL_DAILY_LIMIT` (2000) respuestas con IA al día. Al llegar al tope, el chat sigue funcionando, pero enseña los fragmentos sin IA.
- Caché de 7 días para las primeras preguntas de cada conversación (los bocadillos y las sugerencias).
- `max_tokens: 600`, preguntas de máximo 400 caracteres, rechazo de peticiones de otros orígenes y cabeceras de seguridad (CSP, HSTS, `X-Frame-Options`...).
- Para que los límites se compartan entre instancias de Vercel, añade **Upstash Redis** desde Vercel → Storage, que rellena `UPSTASH_REDIS_REST_*`/`KV_REST_API_*`. Sin Redis, todo va en memoria por instancia.
- Pon también un tope de gasto mensual en OpenAI (Settings → Limits).

## Despliegue

Importa el repo en Vercel y añade `OPENAI_API_KEY` en las variables de entorno. `OPENAI_MODEL` es opcional.

## Licencia

Código bajo licencia [MIT](LICENSE). Los programas electorales y los logos pertenecen a sus respectivos partidos; los logos vienen de Wikimedia Commons.
