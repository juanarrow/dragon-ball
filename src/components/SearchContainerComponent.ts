import { Component } from './Component'
import { CONFIG } from '../config/constants'
import type { AppState } from '../state/stateManager'

export class SearchContainerComponent extends Component {
  private state: AppState

  constructor(state: AppState) {
    super()
    this.state = state
  }

  updateState(newState: AppState): void {
    this.state = newState
    this.update()
  }

  render(): string {
    return `
      <div class="search-container">
        <div class="search-input-wrapper">
          <input 
            type="text" 
            id="search-input" 
            placeholder="Buscar personajes..." 
            class="search-input"
            value="${this.state.searchQuery}"
          />
          <div id="search-indicator" class="search-indicator hidden">
            <div class="search-spinner"></div>
          </div>
        </div>
        <div class="filters-container">
          ${this.generateGenderFilter()}
          ${this.generateRaceFilter()}
        </div>
        <button id="clear-button" class="clear-button">Limpiar</button>
      </div>
    `
  }

  private generateGenderFilter(): string {
    return `
      <select id="gender-filter" class="filter-select">
        ${CONFIG.GENDERS.map(option => 
          `<option value="${option.value}" ${this.state.selectedGender === option.value ? 'selected' : ''}>${option.text}</option>`
        ).join('')}
      </select>
    `
  }

  private generateRaceFilter(): string {
    return `
      <select id="race-filter" class="filter-select">
        ${CONFIG.RACES.map(race => 
          `<option value="${race.value}" ${this.state.selectedRace === race.value ? 'selected' : ''}>${race.text}</option>`
        ).join('')}
      </select>
    `
  }
}
