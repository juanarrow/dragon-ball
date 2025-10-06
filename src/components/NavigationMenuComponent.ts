import { Component } from './Component'
import { router, ROUTES, type Route } from '../router/router'

export class NavigationMenuComponent extends Component {
  private currentRoute: Route

  constructor() {
    super()
    this.currentRoute = router.getCurrentRoute()
    
    // Subscribe to route changes
    router.subscribe((route) => {
      this.currentRoute = route
      this.update()
    })
  }

  render(): string {
    return `
      <nav class="navigation-menu">
        <div class="nav-container">
          <div class="nav-brand">
            <h2 class="nav-title">Dragon Ball Universe</h2>
          </div>
          <div class="nav-links">
            ${ROUTES.map(route => this.generateNavLink(route)).join('')}
          </div>
        </div>
      </nav>
    `
  }

  private generateNavLink(route: Route): string {
    const isActive = this.currentRoute.path === route.path
    const activeClass = isActive ? 'active' : ''
    
    return `
      <button 
        class="nav-link ${activeClass}" 
        data-path="${route.path}"
        onclick="window.navigateTo('${route.path}')"
      >
        ${route.name}
      </button>
    `
  }
}
