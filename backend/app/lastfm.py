import os
import pylast
from dotenv import load_dotenv

load_dotenv()

_cache = {}

def get_lastfm_network():
    return pylast.LastFMNetwork(
        api_key=os.getenv("LASTFM_API_KEY")
    )

def get_artist_tags(artist_name: str) -> list:
    cache_key = f"tags_{artist_name}"
    if cache_key in _cache:
        return _cache[cache_key]
    try:
        network = get_lastfm_network()
        artist = network.get_artist(artist_name)
        tags = artist.get_top_tags(limit=5)
        result = [tag.item.get_name().lower() for tag in tags]
    except Exception:
        result = []
    _cache[cache_key] = result
    return result

def get_artist_similar(artist_name: str) -> list:
    cache_key = f"similar_{artist_name}"
    if cache_key in _cache:
        return _cache[cache_key]
    try:
        network = get_lastfm_network()
        artist = network.get_artist(artist_name)
        similar = artist.get_similar(limit=5)
        result = [s.item.get_name() for s in similar]
    except Exception:
        result = []
    _cache[cache_key] = result
    return result

def get_dominant_genres(tracks: list) -> list:
    genre_count = {}
    for track in tracks:
        for tag in track.get("tags", []):
            for genre in ["rock", "pop", "hip-hop", "rnb", "electronic", "metal", "jazz", "indie", "anime", "j-pop", "alternative", "punk"]:
                if genre in tag.lower():
                    genre_count[genre] = genre_count.get(genre, 0) + 1
    sorted_genres = sorted(genre_count.items(), key=lambda x: x[1], reverse=True)
    return [g[0] for g in sorted_genres[:4]]

from concurrent.futures import ThreadPoolExecutor, as_completed

def enrich_tracks_with_lastfm(tracks: list) -> list:
    unique_artists = list(dict.fromkeys([t["artist"] for t in tracks]))
    
    artist_data = {}
    
    def fetch_artist(artist_name):
        tags = get_artist_tags(artist_name)
        similar = get_artist_similar(artist_name)
        return artist_name, {"tags": tags, "similar": similar}
    
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(fetch_artist, artist): artist for artist in unique_artists}
        for future in as_completed(futures):
            artist_name, data = future.result()
            artist_data[artist_name] = data

    enriched = []
    for track in tracks:
        track["tags"] = artist_data.get(track["artist"], {}).get("tags", [])
        track["similar_artists"] = artist_data.get(track["artist"], {}).get("similar", [])
        enriched.append(track)

    return enriched