import type { Character, ApiError } from '../types/dragonball'

export interface AppState {
  characters: Character[]
  currentPage: number
  totalPages: number
  isLoading: boolean
  hasError: boolean
  errorMessage: string
  searchQuery: string
  isSearching: boolean
  selectedGender: string
  selectedRace: string
}

export class StateManager {
  private state: AppState
  private listeners: Array<(state: AppState) => void> = []

  constructor() {
    this.state = {
      characters: [],
      currentPage: 1,
      totalPages: 1,
      isLoading: false,
      hasError: false,
      errorMessage: '',
      searchQuery: '',
      isSearching: false,
      selectedGender: '',
      selectedRace: ''
    }
  }

  getState(): AppState {
    return { ...this.state }
  }

  setState(updates: Partial<AppState>): void {
    this.state = { ...this.state, ...updates }
    this.notifyListeners()
  }

  subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state))
  }

  // Métodos específicos para el estado
  setLoading(loading: boolean): void {
    this.setState({ isLoading: loading })
  }

  setError(error: ApiError | null): void {
    this.setState({
      hasError: !!error,
      errorMessage: error?.message || ''
    })
  }

  setCharacters(characters: Character[], append: boolean = false): void {
    const newCharacters = append 
      ? [...this.state.characters, ...characters]
      : characters
    this.setState({ characters: newCharacters })
  }

  setPagination(currentPage: number, totalPages: number): void {
    this.setState({ currentPage, totalPages })
  }

  setSearchFilters(query: string, gender: string, race: string): void {
    this.setState({
      searchQuery: query,
      selectedGender: gender,
      selectedRace: race,
      isSearching: query.length > 0 || gender !== '' || race !== ''
    })
  }

  clearSearch(): void {
    this.setState({
      searchQuery: '',
      selectedGender: '',
      selectedRace: '',
      isSearching: false,
      currentPage: 1,
      characters: []
    })
  }

  hasActiveFilters(): boolean {
    return this.state.searchQuery.trim() !== '' || 
           this.state.selectedGender !== '' || 
           this.state.selectedRace !== ''
  }
}

export const stateManager = new StateManager()
