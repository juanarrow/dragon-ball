export type PageType = 'characters' | 'planets' | 'character-detail'

export interface Route {
  path: string
  name: string
  pageType: PageType
  characterId?: number
}

export const ROUTES: Route[] = [
  { path: '/', name: 'Personajes', pageType: 'characters' },
  { path: '/planets', name: 'Planetas', pageType: 'planets' }
]

export class Router {
  private currentRoute: Route = ROUTES[0]
  private listeners: ((route: Route) => void)[] = []

  getCurrentRoute(): Route {
    return this.currentRoute
  }

  navigateTo(path: string): void {
    const route = ROUTES.find(r => r.path === path)
    if (route) {
      this.currentRoute = route
      this.notifyListeners()
    }
  }

  navigateToCharacterDetail(characterId: number): void {
    this.currentRoute = {
      path: `/character/${characterId}`,
      name: 'Detalle del Personaje',
      pageType: 'character-detail',
      characterId
    }
    this.notifyListeners()
  }

  subscribe(listener: (route: Route) => void): () => void {
    this.listeners.push(listener)
    listener(this.currentRoute) // Notify immediately
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentRoute))
  }
}

export const router = new Router()
