import { dragonBallService } from '../services/dragonBallService'
import type { Planet, ApiError, PlanetApiResponse } from '../types/dragonball'
import { stateManager } from '../state/stateManager'
import { uiManager } from '../ui/uiManager'
import { CONFIG } from '../config/constants'

export class PlanetService {
  private searchTimeout: number | null = null

  async loadPlanets(page: number = 1, append: boolean = false): Promise<void> {
    const state = stateManager.getState()

    if (state.isLoading) return

    stateManager.setLoading(true)
    uiManager.updateLoadingIndicator(true, state.currentPage, state.totalPages, state.planets.length > 0)

    try {
      const response = await dragonBallService.getAllPlanets(page, CONFIG.DEFAULT_PAGE_SIZE)

      if (!response || typeof response !== 'object') {
        throw new Error('Respuesta inválida del servidor')
      }

      const { planets, currentPage, totalPages } = this.processResponse(response)

      stateManager.setPlanets(planets, append)
      stateManager.setPagination(currentPage, totalPages)
      stateManager.setError(false)

      if (stateManager.getState().currentPage < stateManager.getState().totalPages) {
        this.setupInfiniteScroll()
      }

    } catch (error) {
      console.error('Error cargando planetas:', error)
      const errorMessage = (error as ApiError).message || 'Error desconocido al cargar planetas'
      stateManager.setError(true, errorMessage)
      if (!append) {
        uiManager.renderError(error as ApiError)
      } else {
        uiManager.updateLoadingIndicator(false, state.currentPage, state.totalPages, state.planets.length > 0)
      }
    } finally {
      stateManager.setLoading(false)
      uiManager.updateLoadingIndicator(false, stateManager.getState().currentPage, stateManager.getState().totalPages, stateManager.getState().planets.length > 0)
    }
  }

  private processResponse(response: PlanetApiResponse): {
    planets: Planet[]
    currentPage: number
    totalPages: number
  } {
    let planets: Planet[]
    let currentPage: number
    let totalPages: number

    if (Array.isArray(response)) {
      planets = response
      currentPage = 1
      totalPages = 1
    } else {
      planets = response.items || []
      currentPage = response.meta?.currentPage || 1
      totalPages = response.meta?.totalPages || 1
    }
    return { planets, currentPage, totalPages }
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
        this.loadMorePlanets()
      }
    }

    window.removeEventListener('scroll', handleScroll)
    window.addEventListener('scroll', handleScroll)
  }

  loadMorePlanets(): void {
    const state = stateManager.getState()
    if (state.currentPage < state.totalPages && !state.isLoading) {
      this.loadPlanets(state.currentPage + 1, true)
    }
  }

  clearPlanets(): void {
    stateManager.resetState()
    uiManager.updateSearchIndicator(false)
    this.loadPlanets(1, false)
  }
}

export const planetService = new PlanetService()
