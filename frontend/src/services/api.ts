import axios from 'axios'

const API_URL = 'https://soundmatch-backend.onrender.com'

export const getTopTracks = async (token: string) => {
  const response = await axios.get(`${API_URL}/auth/top-tracks`, {
    params: { token }
  })
  return response.data.tracks
}

export const getRecommendations = async (token: string) => {
  const response = await axios.get(`${API_URL}/auth/recommendations`, {
    params: { token }
  })
  return response.data.recommendations
}

export const getUserProfile = async (token: string) => {
  const response = await axios.get(`${API_URL}/auth/me`, {
    params: { token }
  })
  return response.data
}

export const getRecentTracks = async (token: string) => {
  const response = await axios.get(`${API_URL}/auth/recent-tracks`, {
    params: { token }
  })
  return response.data.tracks
}

export const searchTracks = async (token: string, query: string) => {
  const response = await axios.get(`${API_URL}/auth/search`, {
    params: { token, query }
  })
  return response.data.tracks
}

export const recommendByTrack = async (token: string, trackId: string) => {
  const response = await axios.get(`${API_URL}/auth/recommend-by-track`, {
    params: { token, track_id: trackId }
  })
  return response.data.tracks
}

export const loginUrl = `${API_URL}/auth/login`