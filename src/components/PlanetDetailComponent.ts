import { Component } from './Component'
import type { Planet } from '../types/dragonball'

export class PlanetDetailComponent extends Component {
  private planet: Planet

  constructor(planet: Planet) {
    super()
    this.planet = planet
  }

  render(): string {
    const destructionIcon = this.planet.isDestroyed ? '💥' : '🌍'
    const destructionStatus = this.planet.isDestroyed ? 'Destruido' : 'Intacto'
    const destructionClass = this.planet.isDestroyed ? 'destroyed' : 'intact'
    
    return `
      <div class="planet-detail-container">
        <div class="planet-detail-header">
          <button id="back-button" class="back-button">
            <span class="back-icon">←</span> Volver
          </button>
          <h1 class="planet-detail-title">${this.planet.name}</h1>
        </div>
        <div class="planet-detail-content">
          <div class="planet-detail-image-section">
            <img src="${this.planet.image}" alt="${this.planet.name}" class="planet-detail-image" />
          </div>
          <div class="planet-detail-info">
            <div class="planet-detail-section">
              <h2 class="section-title">Información General</h2>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Estado</span>
                  <span class="info-value">
                    <span class="status-icon ${destructionClass}">${destructionIcon}</span>
                    ${destructionStatus}
                  </span>
                </div>
                <div class="info-item">
                  <span class="info-label">Descripción</span>
                  <span class="info-value">${this.planet.description}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }
}
