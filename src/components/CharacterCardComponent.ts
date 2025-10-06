import { Component } from './Component'
import { CONFIG } from '../config/constants'
import type { Character } from '../types/dragonball'

export class CharacterCardComponent extends Component {
  private character: Character

  constructor(character: Character) {
    super()
    this.character = character
  }

  updateCharacter(newCharacter: Character): void {
    this.character = newCharacter
    this.update()
  }

  render(): string {
    const genderIcon = this.getGenderIcon(this.character.gender)
    
    return `
      <div class="character-card" data-character-id="${this.character.id}">
        <img src="${this.character.image}" alt="${this.character.name}" class="character-image" />
        <div class="character-info">
          <h3 class="character-name">${this.character.name}</h3>
          <div class="character-stats">
            <div class="stat-item">
              <div class="stat-icon gender-icon">${genderIcon}</div>
              <div class="stat-label">Género</div>
              <div class="stat-value">${this.character.gender}</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon ki-icon">${CONFIG.ICONS.KI}</div>
              <div class="stat-label">Ki</div>
              <div class="stat-value">${this.character.ki}</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon max-ki-icon">${CONFIG.ICONS.MAX_KI}</div>
              <div class="stat-label">Max Ki</div>
              <div class="stat-value">${this.character.maxKi}</div>
            </div>
          </div>
        </div>
      </div>
    `
  }

  private getGenderIcon(gender: string): string {
    switch (gender) {
      case 'Male': return CONFIG.ICONS.GENDER.MALE
      case 'Female': return CONFIG.ICONS.GENDER.FEMALE
      default: return CONFIG.ICONS.GENDER.UNKNOWN
    }
  }
}
