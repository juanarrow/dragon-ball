import { dragonBallService } from '../services/dragonBallService'
import type { Character, ApiError, CharacterApiResponse } from '../types/dragonball'
import { stateManager } from '../state/stateManager'
import { uiManager } from '../ui/uiManager'
import { CONFIG } from '../config/constants'

export class CharacterService {
  private searchTimeout: number | null = null

  async loadCharacters(page: number = 1, append: boolean = false): Promise<void> {
    const state = stateManager.getState()
    
    if (state.isLoading) return
    
    stateManager.setLoading(true)
    uiManager.updateLoadingIndicator(true, state.currentPage, state.totalPages)
    
    try {
      const response = await this.fetchCharacters(page, state)
      const { characters, currentPage, totalPages } = this.processResponse(response)
      
      stateManager.setCharacters(characters, append)
      stateManager.setPagination(currentPage, totalPages)
      stateManager.setError(null)
      
      uiManager.renderCharacters(stateManager.getState())
      
      if (currentPage < totalPages) {
        this.setupInfiniteScroll()
      }
      
    } catch (error) {
      console.error('Error cargando personajes:', error)
      const apiError = error as ApiError
      stateManager.setError(apiError)
      
      if (!append) {
        uiManager.renderError(apiError)
      } else {
        uiManager.updateLoadingIndicator(false, state.currentPage, state.totalPages)
      }
    } finally {
      stateManager.setLoading(false)
      uiManager.updateLoadingIndicator(false, state.currentPage, state.totalPages)
    }
  }

  private async fetchCharacters(page: number, state: any): Promise<CharacterApiResponse> {
    if (stateManager.hasActiveFilters()) {
      return await dragonBallService.searchCharactersWithFilters(
        state.searchQuery.trim(),
        state.selectedGender,
        state.selectedRace
      )
    } else {
      return await dragonBallService.getAllCharacters(page, CONFIG.DEFAULT_PAGE_SIZE)
    }
  }

  private processResponse(response: CharacterApiResponse): {
    characters: Character[]
    currentPage: number
    totalPages: number
  } {
    if (!response || typeof response !== 'object') {
      throw new Error('Respuesta inválida del servidor')
    }
    
    if (Array.isArray(response)) {
      return {
        characters: response,
        currentPage: 1,
        totalPages: 1
      }
    } else {
      return {
        characters: response.items || [],
        currentPage: response.meta?.currentPage || 1,
        totalPages: response.meta?.totalPages || 1
      }
    }
  }

  setupInfiniteScroll(): void {
    const handleScroll = (): void => {
      const state = stateManager.getState()
      
      if (state.isLoading || state.currentPage >= state.totalPages) {
        return
      }
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      if (scrollTop + windowHeight >= documentHeight - CONFIG.INFINITE_SCROLL_THRESHOLD) {
        this.loadMoreCharacters()
      }
    }
    
    window.removeEventListener('scroll', handleScroll)
    window.addEventListener('scroll', handleScroll)
  }

  private loadMoreCharacters(): void {
    const state = stateManager.getState()
    if (state.currentPage < state.totalPages && !state.isLoading) {
      this.loadCharacters(state.currentPage + 1, true)
    }
  }

  debounceSearch(query: string): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
    
    const state = stateManager.getState()
    const isSearching = query.length > 0 || state.selectedGender !== '' || state.selectedRace !== ''
    uiManager.updateSearchIndicator(isSearching)
    
    this.searchTimeout = setTimeout(() => {
      stateManager.setSearchFilters(query, state.selectedGender, state.selectedRace)
      stateManager.setState({ currentPage: 1, characters: [] })
      this.loadCharacters(1, false)
      
      uiManager.updateSearchIndicator(false)
    }, CONFIG.SEARCH_DEBOUNCE_DELAY)
  }

  handleFilterChange(gender: string, race: string): void {
    const state = stateManager.getState()
    stateManager.setSearchFilters(state.searchQuery, gender, race)
    this.debounceSearch(state.searchQuery)
  }

  clearSearch(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
    
    stateManager.clearSearch()
    uiManager.updateSearchIndicator(false)
    this.loadCharacters(1, false)
  }

  setupSearchHandlers(): void {
    const searchInput = document.getElementById('search-input') as HTMLInputElement
    const clearButton = document.getElementById('clear-button')
    const genderFilter = document.getElementById('gender-filter') as HTMLSelectElement
    const raceFilter = document.getElementById('race-filter') as HTMLSelectElement
    
    const performSearch = (): void => {
      const query = searchInput.value.trim()
      this.debounceSearch(query)
    }
    
    const handleFilterChange = (): void => {
      this.handleFilterChange(genderFilter.value, raceFilter.value)
    }
    
    const clearSearch = (): void => {
      searchInput.value = ''
      genderFilter.value = ''
      raceFilter.value = ''
      this.clearSearch()
    }
    
    searchInput?.addEventListener('input', performSearch)
    genderFilter?.addEventListener('change', handleFilterChange)
    raceFilter?.addEventListener('change', handleFilterChange)
    clearButton?.addEventListener('click', clearSearch)
  }
}

export const characterService = new CharacterService()
