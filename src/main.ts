import './style.css'
import { stateManager } from './state/stateManager'
import { uiManager } from './ui/uiManager'
import { characterService } from './services/characterService'

class DragonBallApp {
  constructor() {
    this.initializeApp()
  }

  private initializeApp(): void {
    this.setupStateSubscription()
    this.loadInitialData()
  }

  private setupStateSubscription(): void {
    stateManager.subscribe((state) => {
      // Actualizar UI cuando el estado cambie
      if (!state.hasError) {
        uiManager.renderCharacters(state)
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