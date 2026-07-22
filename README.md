## 🎵 SoundMatch

[![Demo](https://img.shields.io/badge/Demo-Live-green)](https://soundmatch-flax.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-blue)](https://soundmatch-backend.onrender.com)

Sistema de recomendación de música personalizado que conecta tu cuenta de Spotify y utiliza Machine Learning para descubrir canciones que no sabías que necesitabas.

![SoundMatch Dashboard](https://github.com/user-attachments/assets/49a792f4-9f6e-4fd6-b846-03c8fcbdf0a4)

## ✨ Features

- **OAuth con Spotify** — Autenticación segura con tu cuenta real de Spotify
- **Recomendaciones ML** — Modelo de similitud de coseno enriquecido con datos de Last.fm
- **Géneros y moods reales** — Integración con Last.fm API para features de audio reales
- **Explicabilidad** — Visualización de por qué se recomendó cada canción
- **Búsqueda inteligente** — Busca una canción y descubre música similar que no conoces
- **Historial reciente** — Visualiza tus últimas 50 canciones escuchadas
- **Cache inteligente** — Navegación fluida sin recargas innecesarias
- **Loading skeleton** — UX profesional mientras cargan los datos

## 🛠️ Tech Stack

### Backend
- **FastAPI** — API REST con Python
- **spotipy** — Cliente oficial de Spotify Web API
- **pylast** — Integración con Last.fm API
- **scikit-learn** — Modelo ML (cosine similarity + MinMaxScaler)
- **pandas / numpy** — Feature engineering y procesamiento de datos
- **ThreadPoolExecutor** — Paralelización de llamadas a Last.fm

### Frontend
- **React + TypeScript** — UI con tipado estático
- **Tailwind CSS** — Estilos utility-first
- **React Router** — Navegación SPA
- **Recharts** — Gráficas de explicabilidad
- **Axios** — Cliente HTTP

### Infraestructura
- **Vercel** — Deploy del frontend ✅
- **Render** — Deploy del backend con Docker ✅
- **Docker** — Containerización del backend ✅
- **Docker Hub** — Registry de la imagen (chesebread/soundmatch-backend)

## 🧠 Cómo funciona el modelo ML

1. Se obtienen las **top 50 canciones** del usuario vía Spotify API
2. **Last.fm API** enriquece cada artista con géneros musicales y mood tags
3. Se construye un **vector de features** por canción:
   - Duración, contenido explícito, popularidad
   - Frecuencia del artista en el historial
   - Género musical (Rock, Pop, J-Pop, Indie, Metal, etc.)
   - Mood (Chill, Agresivo, Energético, Melancólico, etc.)
4. Se calculan géneros dominantes del usuario
5. Se buscan **canciones nuevas** de esos géneros en Spotify
6. El modelo rankea las candidatas por **similitud de coseno** con el perfil del usuario
7. Se regresa un top 10 con scores normalizados (70-95%) y explicabilidad por feature

## 🚀 Instalación local

### Requisitos
- Python 3.10+
- Node.js 18+
- Cuenta de Spotify Developer
- API Key de Last.fm

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Crea un archivo `.env` en `/backend`:

```env
SPOTIFY_CLIENT_ID=tu_client_id
SPOTIFY_CLIENT_SECRET=tu_client_secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:8000/auth/callback
LASTFM_API_KEY=tu_lastfm_api_key
DATABASE_URL=postgresql://postgres:password@localhost:5432/soundmatch
```

```bash
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173` en tu navegador.

## 📁 Estructura del proyecto

```
soundmatch/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app + CORS
│   │   ├── auth.py          # Endpoints OAuth y recomendaciones
│   │   ├── recommender.py   # Modelo ML con cosine similarity
│   │   ├── lastfm.py        # Integración Last.fm API
│   │   ├── database.py      # Configuración PostgreSQL
│   │   └── models.py        # Modelos SQLAlchemy
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx        # Pantalla de login con OAuth
│   │   │   ├── Dashboard.tsx    # Dashboard principal
│   │   │   └── Search.tsx       # Búsqueda de canciones
│   │   ├── components/
│   │   │   ├── TrackCard.tsx    # Card de canción con hover effects
│   │   │   ├── ExplainChart.tsx # Gráfica de explicabilidad
│   │   │   └── Skeleton.tsx     # Loading skeleton
│   │   └── services/
│   │       └── api.ts           # Cliente HTTP con Axios
│   └── package.json
└── .gitignore
```

## 🔑 Variables de entorno

| Variable | Descripción |
|---|---|
| `SPOTIFY_CLIENT_ID` | Client ID de tu app en Spotify Developer Dashboard |
| `SPOTIFY_CLIENT_SECRET` | Client Secret de tu app en Spotify Developer Dashboard |
| `SPOTIFY_REDIRECT_URI` | URI de callback OAuth (`http://127.0.0.1:8000/auth/callback`) |
| `LASTFM_API_KEY` | API Key de Last.fm |
| `DATABASE_URL` | URL de conexión a PostgreSQL |

## 🗺️ Roadmap

- [x] OAuth con Spotify
- [x] Modelo ML con cosine similarity
- [x] Integración Last.fm para géneros reales
- [x] Explicabilidad de recomendaciones
- [x] Búsqueda de canciones similares
- [x] Historial reciente
- [x] Dockerización con Docker
- [x] Deploy backend en Render
- [x] Deploy frontend en Vercel
- [ ] CI/CD con GitHub Actions
- [ ] Modelo XGBoost con SHAP real

## 👨‍💻 Autor

**Saúl Vázquez** — Full Stack Developer & Data Science

[![Portfolio](https://img.shields.io/badge/Portfolio-portafolio--saul--vazquez.vercel.app-green)](https://portafolio-saul-vazquez.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-SaulVaz-black)](https://github.com/SaulVaz)
