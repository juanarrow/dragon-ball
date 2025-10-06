import type { ApiError } from '../types/dragonball'
import type { AppState } from '../state/stateManager'
import {
  HeaderComponent,
  SearchContainerComponent,
  CharactersGridComponent,
  LoadingIndicatorComponent,
  EndMessageComponent,
  ErrorContainerComponent
} from '../components'

export class UIManager {
  private app: HTMLDivElement
  private headerComponent: HeaderComponent
  private searchContainerComponent: SearchContainerComponent
  private charactersGridComponent: CharactersGridComponent
  private loadingIndicatorComponent: LoadingIndicatorComponent
  private endMessageComponent: EndMessageComponent

  constructor() {
    this.app = document.querySelector<HTMLDivElement>('#app')!
    
    // Inicializar componentes
    this.headerComponent = new HeaderComponent()
    this.searchContainerComponent = new SearchContainerComponent({
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
    })
    this.charactersGridComponent = new CharactersGridComponent([])
    this.loadingIndicatorComponent = new LoadingIndicatorComponent()
    this.endMessageComponent = new EndMessageComponent()
  }

  renderCharacters(state: AppState): void {
    this.app.innerHTML = '<div class="container"></div>'
    const container = this.app.querySelector('.container')!
    
    // Montar componentes
    this.headerComponent.mount(container as HTMLElement)
    this.searchContainerComponent.updateState(state)
    this.charactersGridComponent.updateCharacters(state.characters)
    this.loadingIndicatorComponent.setLoading(state.isLoading)
    this.endMessageComponent.setVisible(state.currentPage >= state.totalPages && state.characters.length > 0)
    
    // Agregar componentes al DOM
    container.innerHTML = `
      ${this.headerComponent.render()}
      ${this.searchContainerComponent.render()}
      ${this.charactersGridComponent.render()}
      ${this.loadingIndicatorComponent.render()}
      ${this.endMessageComponent.render()}
    `
    
    this.setupEventListeners()
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
    // Los event listeners se configurarán desde el módulo principal
    // para mantener la separación de responsabilidades
  }
}

export const uiManager = new UIManager()