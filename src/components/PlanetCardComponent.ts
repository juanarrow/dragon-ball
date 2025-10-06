import { Component } from './Component'
import type { Planet } from '../types/dragonball'

export class PlanetCardComponent extends Component {
  private planet: Planet

  constructor(planet: Planet) {
    super()
    this.planet = planet
  }

  updatePlanet(newPlanet: Planet): void {
    this.planet = newPlanet
    this.update()
  }

  render(): string {
    return `
      <div class="planet-card" data-planet-id="${this.planet.id}">
        <div class="planet-image-container">
          <img src="${this.planet.image}" alt="${this.planet.name}" class="planet-image" />
        </div>
        <div class="planet-info">
          <h3 class="planet-name">${this.planet.name}</h3>
          <div class="planet-details">
            <div class="planet-detail-item">
              <div class="destruction-status">
                <div class="status-icon ${this.planet.isDestroyed ? 'destroyed' : 'intact'}">
                  ${this.planet.isDestroyed ? '💥' : '🌍'}
                </div>
                <div class="status-label">${this.planet.isDestroyed ? 'Destruido' : 'Intacto'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }
}
