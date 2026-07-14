import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity

MOOD_TAGS = {
    "happy": ["happy", "feel-good", "upbeat", "fun", "positive"],
    "sad": ["sad", "melancholic", "emotional", "heartbreak", "depressing"],
    "aggressive": ["aggressive", "angry", "intense", "heavy", "brutal"],
    "chill": ["chill", "lo-fi", "relaxing", "calm", "peaceful", "ambient"],
    "energetic": ["energetic", "party", "dance", "hype", "workout"],
    "romantic": ["romantic", "love", "sensual", "passionate"]
}

def get_mood_vector(tags: list) -> dict:
    vector = {mood: 0.0 for mood in MOOD_TAGS}
    for tag in tags:
        for mood, keywords in MOOD_TAGS.items():
            if any(kw in tag for kw in keywords):
                vector[mood] = 1.0
    return vector

def get_genre_vector(tags: list) -> dict:
    genres = ["rock", "pop", "hip-hop", "rnb", "electronic", "metal", "jazz", "indie", "anime", "j-pop"]
    vector = {f"genre_{g}": 0.0 for g in genres}
    for tag in tags:
        for genre in genres:
            if genre in tag:
                vector[f"genre_{genre}"] = 1.0
    return vector

def build_features(tracks: list) -> tuple:
    df = pd.DataFrame(tracks)

    df["duration_min"] = df["duration_ms"] / 60000
    df["explicit_num"] = df["explicit"].astype(int)
    df["popularity_norm"] = df["popularity"] / 100.0
    df["artist_freq"] = df["artist"].map(df["artist"].value_counts())
    df["artist_freq_norm"] = df["artist_freq"] / df["artist_freq"].max()
    df["name_length"] = df["name"].apply(len) / 50.0
    df["has_feat"] = df["name"].str.contains("feat|ft\.|&", case=False).astype(int)

    if "tags" in df.columns:
        mood_df = df["tags"].apply(lambda t: pd.Series(get_mood_vector(t if isinstance(t, list) else [])))
        genre_df = df["tags"].apply(lambda t: pd.Series(get_genre_vector(t if isinstance(t, list) else [])))
        df = pd.concat([df, mood_df, genre_df], axis=1)
        mood_cols = list(MOOD_TAGS.keys())
        genre_cols = [f"genre_{g}" for g in ["rock", "pop", "hip-hop", "rnb", "electronic", "metal", "jazz", "indie", "anime", "j-pop"]]
    else:
        mood_cols = []
        genre_cols = []

    base_features = ["duration_min", "explicit_num", "popularity_norm", "artist_freq_norm", "name_length", "has_feat"]
    all_features = base_features + mood_cols + genre_cols

    features = df[all_features].fillna(0).copy()
    scaler = MinMaxScaler()
    features_scaled = scaler.fit_transform(features)
    return df, features_scaled, all_features

def get_feature_contributions(row_features: np.ndarray, feature_names: list) -> list:
    labels = {
        "duration_min": "Duración similar",
        "explicit_num": "Contenido explícito",
        "popularity_norm": "Popularidad",
        "artist_freq_norm": "Artista frecuente",
        "name_length": "Longitud del título",
        "has_feat": "Colaboración",
        "happy": "Mood: Alegre",
        "sad": "Mood: Melancólico",
        "aggressive": "Mood: Agresivo",
        "chill": "Mood: Chill",
        "energetic": "Mood: Energético",
        "romantic": "Mood: Romántico",
        "genre_rock": "Género: Rock",
        "genre_pop": "Género: Pop",
        "genre_hip-hop": "Género: Hip-Hop",
        "genre_rnb": "Género: R&B",
        "genre_electronic": "Género: Electrónico",
        "genre_metal": "Género: Metal",
        "genre_jazz": "Género: Jazz",
        "genre_indie": "Género: Indie",
        "genre_anime": "Género: Anime",
        "genre_j-pop": "Género: J-Pop"
    }

    contributions = []
    for i, name in enumerate(feature_names):
        val = float(row_features[i])
        if val > 0:
            contributions.append({
                "feature": labels.get(name, name),
                "value": round(val, 4)
            })

    contributions.sort(key=lambda x: x["value"], reverse=True)
    return contributions[:6]

def get_recommendations(tracks: list, top_n: int = 10) -> list:
    if len(tracks) < 2:
        return []

    df, features_scaled, feature_names = build_features(tracks)
    similarity_matrix = cosine_similarity(features_scaled)

    avg_similarity = similarity_matrix.mean(axis=1)
    noise = np.random.normal(0, 0.02, size=avg_similarity.shape)
    avg_similarity = avg_similarity + noise

    min_val = avg_similarity.min()
    max_val = avg_similarity.max()
    if max_val > min_val:
        avg_similarity = 0.70 + (avg_similarity - min_val) / (max_val - min_val) * 0.25
    avg_similarity = np.clip(avg_similarity, 0.70, 0.95)

    df["similarity_score"] = avg_similarity
    recommendations = df.sort_values("similarity_score", ascending=False).head(top_n)

    result = []
    for idx, row in recommendations.iterrows():
        contributions = get_feature_contributions(features_scaled[idx], feature_names)
        result.append({
            "id": row["id"],
            "name": row["name"],
            "artist": row["artist"],
            "album": row["album"],
            "image": row["image"],
            "similarity_score": round(float(row["similarity_score"]), 4),
            "contributions": contributions
        })
    return result