import type { Character, CharacterResponse, Planet, PlanetResponse, ApiError, CharacterApiResponse } from '../types/dragonball';

class DragonBallService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = 'https://dragonball-api.com/api';
    this.timeout = 10000;
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const apiError: ApiError = {
        message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      };
      throw apiError;
    }

    return response.json();
  }

  async getAllCharacters(page: number = 1, limit: number = 10): Promise<CharacterResponse> {
    try {
      const url = `${this.baseURL}/characters?page=${page}&limit=${limit}`;
      const response = await this.fetchWithTimeout(url);
      return this.handleResponse<CharacterResponse>(response);
    } catch (error) {
      throw error as ApiError;
    }
  }

  async getCharacterById(id: number): Promise<Character> {
    try {
      const url = `${this.baseURL}/characters/${id}`;
      const response = await this.fetchWithTimeout(url);
      return this.handleResponse<Character>(response);
    } catch (error) {
      throw error as ApiError;
    }
  }

  async getRandomCharacter(): Promise<Character> {
    try {
      const url = `${this.baseURL}/characters/random`;
      const response = await this.fetchWithTimeout(url);
      return this.handleResponse<Character>(response);
    } catch (error) {
      throw error as ApiError;
    }
  }

  async searchCharacters(query: string, page: number = 1, limit: number = 10): Promise<CharacterApiResponse> {
    try {
      const url = `${this.baseURL}/characters?name=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
      const response = await this.fetchWithTimeout(url);
      return this.handleResponse<CharacterApiResponse>(response);
    } catch (error) {
      throw error as ApiError;
    }
  }

  async searchCharactersWithFilters(
    name: string = '',
    gender: string = '',
    race: string = ''
  ): Promise<CharacterApiResponse> {
    try {
      const params = new URLSearchParams();
      
      if (name.trim()) params.append('name', name.trim());
      if (gender) params.append('gender', gender);
      if (race) params.append('race', race);
      
      const url = `${this.baseURL}/characters?${params.toString()}`;
      const response = await this.fetchWithTimeout(url);
      return this.handleResponse<CharacterApiResponse>(response);
    } catch (error) {
      throw error as ApiError;
    }
  }

  async getAllPlanets(page: number = 1, limit: number = 10): Promise<PlanetResponse> {
    try {
      const url = `${this.baseURL}/planets?page=${page}&limit=${limit}`;
      const response = await this.fetchWithTimeout(url);
      return this.handleResponse<PlanetResponse>(response);
    } catch (error) {
      throw error as ApiError;
    }
  }

  async getPlanetById(id: number): Promise<Planet> {
    try {
      const url = `${this.baseURL}/planets/${id}`;
      const response = await this.fetchWithTimeout(url);
      return this.handleResponse<Planet>(response);
    } catch (error) {
      throw error as ApiError;
    }
  }

  async getRandomPlanet(): Promise<Planet> {
    try {
      const url = `${this.baseURL}/planets/random`;
      const response = await this.fetchWithTimeout(url);
      return this.handleResponse<Planet>(response);
    } catch (error) {
      throw error as ApiError;
    }
  }
}

export const dragonBallService = new DragonBallService();
export default dragonBallService;
