import './style.css'
import { dragonBallService } from './services/dragonBallService'
import type { Character, ApiError, CharacterApiResponse } from './types/dragonball'

interface AppState {
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

const appState: AppState = {
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

let searchTimeout: number | null = null

async function loadCharacters(page: number = 1, append: boolean = false): Promise<void> {
  if (appState.isLoading) return
  
  appState.isLoading = true
  updateLoadingIndicator()
  
  try {
    let response: CharacterApiResponse
    
    const hasFilters = appState.searchQuery.trim() !== '' || appState.selectedGender !== '' || appState.selectedRace !== ''
    
    if (hasFilters) {
      response = await dragonBallService.searchCharactersWithFilters(
        appState.searchQuery.trim(),
        appState.selectedGender,
        appState.selectedRace
      )
    } else {
      response = await dragonBallService.getAllCharacters(page, 20)
    }
    
    if (!response || typeof response !== 'object') {
      throw new Error('Respuesta inválida del servidor')
    }
    
    let characters: Character[]
    let currentPage: number
    let totalPages: number
    
    if (Array.isArray(response)) {
      characters = response
      currentPage = 1
      totalPages = 1
    } else {
      characters = response.items || []
      currentPage = response.meta?.currentPage || 1
      totalPages = response.meta?.totalPages || 1
    }
    
    if (append) {
      appState.characters = [...appState.characters, ...characters]
    } else {
      appState.characters = characters
    }
    
    appState.currentPage = currentPage
    appState.totalPages = totalPages
    appState.hasError = false
    
    displayCharacters(appState.characters)
    
    if (appState.currentPage < appState.totalPages) {
      setupInfiniteScroll()
    }
    
  } catch (error) {
    console.error('Error cargando personajes:', error)
    appState.hasError = true
    appState.errorMessage = (error as ApiError).message || 'Error desconocido al cargar personajes'
    
    if (!append) {
      displayError(error as ApiError)
    } else {
      updateLoadingIndicator()
    }
  } finally {
    appState.isLoading = false
    updateLoadingIndicator()
  }
}

function displayCharacters(characters: Character[]): void {
  const app = document.querySelector<HTMLDivElement>('#app')!
  
  app.innerHTML = `
    <div class="container">
      <h1 class="main-title">
        Personajes de Dragon Ball
      </h1>
      <div class="search-container">
        <div class="search-input-wrapper">
          <input 
            type="text" 
            id="search-input" 
            placeholder="Buscar personajes..." 
            class="search-input"
            value="${appState.searchQuery}"
          />
          <div id="search-indicator" class="search-indicator hidden">
            <div class="search-spinner"></div>
          </div>
        </div>
        <div class="filters-container">
          <select id="gender-filter" class="filter-select">
            <option value="">Todos los géneros</option>
            <option value="Male" ${appState.selectedGender === 'Male' ? 'selected' : ''}>Masculino</option>
            <option value="Female" ${appState.selectedGender === 'Female' ? 'selected' : ''}>Femenino</option>
            <option value="Unknown" ${appState.selectedGender === 'Unknown' ? 'selected' : ''}>Desconocido</option>
          </select>
          <select id="race-filter" class="filter-select">
            <option value="">Todas las razas</option>
            <option value="Human" ${appState.selectedRace === 'Human' ? 'selected' : ''}>Humano</option>
            <option value="Saiyan" ${appState.selectedRace === 'Saiyan' ? 'selected' : ''}>Saiyan</option>
            <option value="Namekian" ${appState.selectedRace === 'Namekian' ? 'selected' : ''}>Namekiano</option>
            <option value="Majin" ${appState.selectedRace === 'Majin' ? 'selected' : ''}>Majin</option>
            <option value="Frieza Race" ${appState.selectedRace === 'Frieza Race' ? 'selected' : ''}>Raza de Freezer</option>
            <option value="Android" ${appState.selectedRace === 'Android' ? 'selected' : ''}>Androide</option>
            <option value="Jiren Race" ${appState.selectedRace === 'Jiren Race' ? 'selected' : ''}>Raza de Jiren</option>
            <option value="God" ${appState.selectedRace === 'God' ? 'selected' : ''}>Dios</option>
            <option value="Angel" ${appState.selectedRace === 'Angel' ? 'selected' : ''}>Ángel</option>
            <option value="Evil" ${appState.selectedRace === 'Evil' ? 'selected' : ''}>Malvado</option>
            <option value="Unknown" ${appState.selectedRace === 'Unknown' ? 'selected' : ''}>Desconocido</option>
          </select>
        </div>
        <button id="clear-button" class="clear-button">Limpiar</button>
      </div>
      <div class="characters-grid">
        ${characters.map(character => `
          <div class="character-card">
            <img src="${character.image}" alt="${character.name}" class="character-image" />
            <div class="character-info">
              <h3 class="character-name">${character.name}</h3>
              <div class="character-stats">
                <div class="stat-item">
                  <div class="stat-icon gender-icon">${character.gender === 'Male' ? '♂' : character.gender === 'Female' ? '♀' : '⚧'}</div>
                  <div class="stat-label">Género</div>
                  <div class="stat-value">${character.gender}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon ki-icon">⚡</div>
                  <div class="stat-label">Ki</div>
                  <div class="stat-value">${character.ki}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon max-ki-icon">💥</div>
                  <div class="stat-label">Max Ki</div>
                  <div class="stat-value">${character.maxKi}</div>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div id="loading-indicator" class="loading-indicator hidden">
        <div class="spinner"></div>
        <p>Cargando más personajes...</p>
      </div>
      <div id="end-message" class="end-message hidden">
        <p>¡Has visto todos los personajes disponibles!</p>
      </div>
    </div>
  `
  
  setupSearchHandlers()
}

function displayError(error: ApiError): void {
  const app = document.querySelector<HTMLDivElement>('#app')!
  
  app.innerHTML = `
    <div class="error-container">
      <h1>Error al cargar personajes</h1>
      <p class="error-message">${error.message}</p>
      <button onclick="location.reload()" class="retry-button">Reintentar</button>
    </div>
  `
}

function setupInfiniteScroll(): void {
  const loadingIndicator = document.getElementById('loading-indicator')
  const endMessage = document.getElementById('end-message')
  
  if (loadingIndicator) loadingIndicator.classList.add('hidden')
  if (endMessage) endMessage.classList.add('hidden')
  
  const handleScroll = (): void => {
    if (appState.isLoading || appState.currentPage >= appState.totalPages) {
      return
    }
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    
    if (scrollTop + windowHeight >= documentHeight - 100) {
      loadMoreCharacters()
    }
  }
  
  window.removeEventListener('scroll', handleScroll)
  window.addEventListener('scroll', handleScroll)
}

function loadMoreCharacters(): void {
  if (appState.currentPage < appState.totalPages && !appState.isLoading) {
    loadCharacters(appState.currentPage + 1, true)
  }
}

function updateLoadingIndicator(): void {
  const loadingIndicator = document.getElementById('loading-indicator')
  const endMessage = document.getElementById('end-message')
  
  if (appState.isLoading) {
    if (loadingIndicator) loadingIndicator.classList.remove('hidden')
  } else {
    if (loadingIndicator) loadingIndicator.classList.add('hidden')
    
    if (appState.currentPage >= appState.totalPages && appState.characters.length > 0) {
      if (endMessage) endMessage.classList.remove('hidden')
    }
  }
}

function debounceSearch(query: string): void {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  const searchIndicator = document.getElementById('search-indicator')
  if (query.length > 0 || appState.selectedGender !== '' || appState.selectedRace !== '') {
    if (searchIndicator) searchIndicator.classList.remove('hidden')
  } else {
    if (searchIndicator) searchIndicator.classList.add('hidden')
  }
  
  searchTimeout = setTimeout(() => {
    appState.searchQuery = query
    appState.isSearching = query.length > 0 || appState.selectedGender !== '' || appState.selectedRace !== ''
    appState.currentPage = 1
    appState.characters = []
    loadCharacters(1, false)
    
    if (searchIndicator) searchIndicator.classList.add('hidden')
  }, 500)
}

function setupSearchHandlers(): void {
  const searchInput = document.getElementById('search-input') as HTMLInputElement
  const clearButton = document.getElementById('clear-button')
  const genderFilter = document.getElementById('gender-filter') as HTMLSelectElement
  const raceFilter = document.getElementById('race-filter') as HTMLSelectElement
  
  const performSearch = (): void => {
    const query = searchInput.value.trim()
    debounceSearch(query)
  }
  
  const handleFilterChange = (): void => {
    appState.selectedGender = genderFilter.value
    appState.selectedRace = raceFilter.value
    const query = searchInput.value.trim()
    debounceSearch(query)
  }
  
  const clearSearch = (): void => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    searchInput.value = ''
    genderFilter.value = ''
    raceFilter.value = ''
    appState.searchQuery = ''
    appState.selectedGender = ''
    appState.selectedRace = ''
    appState.isSearching = false
    appState.currentPage = 1
    appState.characters = []
    
    const searchIndicator = document.getElementById('search-indicator')
    if (searchIndicator) searchIndicator.classList.add('hidden')
    
    loadCharacters(1, false)
  }
  
  searchInput?.addEventListener('input', performSearch)
  genderFilter?.addEventListener('change', handleFilterChange)
  raceFilter?.addEventListener('change', handleFilterChange)
  clearButton?.addEventListener('click', clearSearch)
}

loadCharacters(1, false)
