import { Component } from './Component'

export class LoadingIndicatorComponent extends Component {
  private isLoading: boolean = false

  setLoading(loading: boolean): void {
    this.isLoading = loading
    this.update()
  }

  render(): string {
    const hiddenClass = this.isLoading ? '' : 'hidden'
    return `
      <div id="loading-indicator" class="loading-indicator ${hiddenClass}">
        <div class="spinner"></div>
        <p>Cargando más personajes...</p>
      </div>
    `
  }
}
