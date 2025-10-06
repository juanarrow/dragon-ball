import type { ApiError } from '../types/dragonball'
import type { AppState } from '../state/stateManager'
import { router } from '../router/router'
import {
  NavigationMenuComponent,
  HeaderComponent,
  SearchContainerComponent,
  CharactersGridComponent,
  PlanetsGridComponent,
  CharacterDetailComponent,
  LoadingIndicatorComponent,
  EndMessageComponent,
  ErrorContainerComponent
} from '../components'

export class UIManager {
  private app: HTMLDivElement
  private navigationMenuComponent: NavigationMenuComponent
  private headerComponent: HeaderComponent
  private searchContainerComponent: SearchContainerComponent
  private charactersGridComponent: CharactersGridComponent
  private planetsGridComponent: PlanetsGridComponent
  private characterDetailComponent: CharacterDetailComponent | null = null
  private loadingIndicatorComponent: LoadingIndicatorComponent
  private endMessageComponent: EndMessageComponent
  private characterCardClickHandlerAdded: boolean = false

  constructor() {
    this.app = document.querySelector<HTMLDivElement>('#app')!
    
    // Inicializar componentes
    this.navigationMenuComponent = new NavigationMenuComponent()
    this.headerComponent = new HeaderComponent()
    this.searchContainerComponent = new SearchContainerComponent({
      characters: [],
      planets: [],
      currentPage: 1,
      totalPages: 1,
      isLoading: false,
      hasError: false,
      errorMessage: '',
      searchQuery: '',
      isSearching: false,
      selectedGender: '',
      selectedRace: ''
    })
    this.charactersGridComponent = new CharactersGridComponent([])
    this.planetsGridComponent = new PlanetsGridComponent([])
    this.loadingIndicatorComponent = new LoadingIndicatorComponent()
    this.endMessageComponent = new EndMessageComponent()
  }

  renderPage(state: AppState): void {
    const currentRoute = router.getCurrentRoute()
    
    this.app.innerHTML = '<div class="container"></div>'
    const container = this.app.querySelector('.container')!
    
    // Montar componentes
    this.navigationMenuComponent.mount(container as HTMLElement)
    this.headerComponent.mount(container as HTMLElement)
    
    if (currentRoute.pageType === 'characters') {
      this.renderCharactersPage(state)
    } else if (currentRoute.pageType === 'planets') {
      this.renderPlanetsPage(state)
    } else if (currentRoute.pageType === 'character-detail') {
      this.renderCharacterDetailPage(state, currentRoute.characterId!)
    }
    
    this.setupEventListeners()
  }

  private renderCharactersPage(state: AppState): void {
    const container = this.app.querySelector('.container')!
    
    this.searchContainerComponent.updateState(state)
    this.charactersGridComponent.updateCharacters(state.characters)
    this.loadingIndicatorComponent.setLoading(state.isLoading)
    this.endMessageComponent.setVisible(state.currentPage >= state.totalPages && state.characters.length > 0)
    
    // Agregar componentes al DOM
    container.innerHTML = `
      ${this.navigationMenuComponent.render()}
      ${this.headerComponent.render()}
      ${this.searchContainerComponent.render()}
      ${this.charactersGridComponent.render()}
      ${this.loadingIndicatorComponent.render()}
      ${this.endMessageComponent.render()}
    `
  }

  private renderPlanetsPage(state: AppState): void {
    const container = this.app.querySelector('.container')!
    
    this.planetsGridComponent.updatePlanets(state.planets)
    this.loadingIndicatorComponent.setLoading(state.isLoading)
    this.endMessageComponent.setVisible(state.currentPage >= state.totalPages && state.planets.length > 0)
    
    // Agregar componentes al DOM
    container.innerHTML = `
      ${this.navigationMenuComponent.render()}
      <h1 class="main-title">Planetas de Dragon Ball</h1>
      ${this.planetsGridComponent.render()}
      ${this.loadingIndicatorComponent.render()}
      ${this.endMessageComponent.render()}
    `
  }

  private renderCharacterDetailPage(state: AppState, characterId: number): void {
    const character = state.characters.find(c => c.id === characterId)
    if (!character) {
      this.renderError({ message: 'Personaje no encontrado', status: 404 })
      return
    }

    this.characterDetailComponent = new CharacterDetailComponent(character)
    const container = this.app.querySelector('.container')!
    
    container.innerHTML = `
      ${this.navigationMenuComponent.render()}
      ${this.characterDetailComponent.render()}
    `
    
    this.setupBackButton()
  }

  renderError(error: ApiError): void {
    const errorComponent = new ErrorContainerComponent(error)
    this.app.innerHTML = errorComponent.render()
  }

  updateLoadingIndicator(isLoading: boolean, currentPage: number, totalPages: number): void {
    this.loadingIndicatorComponent.setLoading(isLoading)
    this.endMessageComponent.setVisible(currentPage >= totalPages && document.querySelectorAll('.character-card').length > 0)
    
    // Actualizar en el DOM
    const loadingElement = document.getElementById('loading-indicator')
    const endElement = document.getElementById('end-message')
    
    if (loadingElement) {
      loadingElement.innerHTML = this.loadingIndicatorComponent.render()
    }
    if (endElement) {
      endElement.innerHTML = this.endMessageComponent.render()
    }
  }

  updateSearchIndicator(isSearching: boolean): void {
    const searchIndicator = document.getElementById('search-indicator')
    if (isSearching) {
      searchIndicator?.classList.remove('hidden')
    } else {
      searchIndicator?.classList.add('hidden')
    }
  }

  updateSearchContainer(state: AppState): void {
    this.searchContainerComponent.updateState(state)
    const searchContainer = document.querySelector('.search-container')
    if (searchContainer) {
      searchContainer.innerHTML = this.searchContainerComponent.render()
    }
  }

  private setupEventListeners(): void {
    // Event delegation para tarjetas de personajes
    this.setupCharacterCardClickHandlers()
  }

  private setupCharacterCardClickHandlers(): void {
    // Evitar agregar múltiples event listeners
    if (this.characterCardClickHandlerAdded) {
      return
    }
    
    // Usar event delegation para manejar clicks en cualquier parte de la tarjeta
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      const characterCard = target.closest('.character-card')
      
      if (characterCard) {
        const characterId = characterCard.getAttribute('data-character-id')
        if (characterId) {
          event.preventDefault()
          event.stopPropagation()
          router.navigateToCharacterDetail(parseInt(characterId))
        }
      }
    })
    
    this.characterCardClickHandlerAdded = true
  }

  // Métodos para configurar event listeners desde el exterior
  onSearchInput(callback: (query: string) => void): void {
    const searchInput = document.getElementById('search-input') as HTMLInputElement
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        callback((e.target as HTMLInputElement).value)
      })
    }
  }

  onFilterChange(callback: (gender: string, race: string) => void): void {
    const genderFilter = document.getElementById('gender-filter') as HTMLSelectElement
    const raceFilter = document.getElementById('race-filter') as HTMLSelectElement
    
    if (genderFilter) {
      genderFilter.addEventListener('change', () => {
        const race = raceFilter?.value || ''
        callback(genderFilter.value, race)
      })
    }
    
    if (raceFilter) {
      raceFilter.addEventListener('change', () => {
        const gender = genderFilter?.value || ''
        callback(gender, raceFilter.value)
      })
    }
  }

  onClearSearch(callback: () => void): void {
    const clearButton = document.getElementById('clear-button') as HTMLButtonElement
    if (clearButton) {
      clearButton.addEventListener('click', callback)
    }
  }

  onRetry(callback: () => void): void {
    const retryButton = document.querySelector('.retry-button') as HTMLButtonElement
    if (retryButton) {
      retryButton.addEventListener('click', callback)
    }
  }

  private setupBackButton(): void {
    const backButton = document.getElementById('back-button') as HTMLButtonElement
    if (backButton) {
      backButton.addEventListener('click', () => {
        router.navigateTo('/')
      })
    }
  }
}

export const uiManager = new UIManager()