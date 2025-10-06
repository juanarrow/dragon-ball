import { Component } from './Component'
import type { ApiError } from '../types/dragonball'

export class ErrorContainerComponent extends Component {
  private error: ApiError

  constructor(error: ApiError) {
    super()
    this.error = error
  }

  updateError(newError: ApiError): void {
    this.error = newError
    this.update()
  }

  render(): string {
    return `
      <div class="error-container">
        <h1>Error al cargar personajes</h1>
        <p class="error-message">${this.error.message}</p>
        <button onclick="location.reload()" class="retry-button">Reintentar</button>
      </div>
    `
  }
}
