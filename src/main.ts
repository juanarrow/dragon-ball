import './style.css'
import { stateManager } from './state/stateManager'
import { uiManager } from './ui/uiManager'
import { characterService } from './services/characterService'
import { planetService } from './services/planetService'
import { router } from './router/router'

class DragonBallApp {
  constructor() {
    this.initializeApp()
  }

  private initializeApp(): void {
    this.setupStateSubscription()
    this.setupRouteSubscription()
    this.setupNavigation()
    this.loadInitialData()
  }

  private setupStateSubscription(): void {
    stateManager.subscribe((state) => {
      if (state.hasError) {
        uiManager.renderError({ message: state.errorMessage, status: 500 })
      } else {
        uiManager.renderPage(state)
      }
    })
  }

  private setupRouteSubscription(): void {
    router.subscribe((route) => {
      const state = stateManager.getState()
      
      if (route.pageType === 'characters') {
        if (state.characters.length === 0) {
          characterService.loadCharacters(1, false)
        } else {
          uiManager.renderPage(state)
        }
      } else if (route.pageType === 'planets') {
        if (state.planets.length === 0) {
          planetService.loadPlanets(1, false)
        } else {
          uiManager.renderPage(state)
        }
      } else if (route.pageType === 'character-detail') {
        uiManager.renderPage(state)
      } else if (route.pageType === 'planet-detail') {
        uiManager.renderPage(state)
      }
    })
  }

  private setupNavigation(): void {
    // Setup navigation
    ;(window as any).navigateTo = (path: string) => {
      router.navigateTo(path)
    }

    ;(window as any).navigateToCharacterDetail = (characterId: number) => {
      router.navigateToCharacterDetail(characterId)
    }

    ;(window as any).navigateToPlanetDetail = (planetId: number) => {
      router.navigateToPlanetDetail(planetId)
    }

    // Setup event handlers
    uiManager.onSearchInput((query: string) => characterService.debounceSearch(query))
    uiManager.onFilterChange((gender: string, race: string) => characterService.handleFilterChange(gender, race))
    uiManager.onClearSearch(() => characterService.clearSearch())
    uiManager.onRetry(() => {
      const currentRoute = router.getCurrentRoute()
      if (currentRoute.pageType === 'characters') {
        characterService.loadCharacters(1, false)
      } else if (currentRoute.pageType === 'planets') {
        planetService.loadPlanets(1, false)
      }
    })
  }

  private async loadInitialData(): Promise<void> {
    try {
      await characterService.loadCharacters(1, false)
    } catch (error) {
      console.error('Error inicializando la aplicación:', error)
    }
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new DragonBallApp()
})

// También inicializar inmediatamente si el DOM ya está listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new DragonBallApp()
  })
} else {
  new DragonBallApp()
}