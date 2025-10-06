import { Component } from './Component'
import { PlanetCardComponent } from './PlanetCardComponent'
import type { Planet } from '../types/dragonball'

export class PlanetsGridComponent extends Component {
  private planets: Planet[]

  constructor(planets: Planet[]) {
    super()
    this.planets = planets
  }

  updatePlanets(newPlanets: Planet[]): void {
    this.planets = newPlanets
    this.update()
  }

  render(): string {
    return `
      <div class="planets-grid">
        ${this.planets.map(planet => this.generatePlanetCard(planet)).join('')}
      </div>
    `
  }

  private generatePlanetCard(planet: Planet): string {
    const cardComponent = new PlanetCardComponent(planet)
    return cardComponent.render()
  }
}
