import { Component } from './Component'
import type { Character } from '../types/dragonball'
import { CONFIG } from '../config/constants'

export class CharacterDetailComponent extends Component {
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
      <div class="character-detail-container">
        <div class="character-detail-header">
          <button id="back-button" class="back-button">
            <span class="back-icon">←</span>
            Volver
          </button>
          <h1 class="character-detail-title">${this.character.name}</h1>
        </div>
        
        <div class="character-detail-content">
          <div class="character-detail-image-section">
            <img src="${this.character.image}" alt="${this.character.name}" class="character-detail-image" />
          </div>
          
          <div class="character-detail-info">
            <div class="character-detail-section">
              <h2 class="section-title">Información General</h2>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Nombre</div>
                  <div class="info-value">${this.character.name}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Género</div>
                  <div class="info-value">
                    <span class="gender-icon">${genderIcon}</span>
                    ${this.character.gender}
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-label">Raza</div>
                  <div class="info-value">${this.character.race}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Afiliación</div>
                  <div class="info-value">${this.character.affiliation}</div>
                </div>
              </div>
            </div>

            <div class="character-detail-section">
              <h2 class="section-title">Poder</h2>
              <div class="power-grid">
                <div class="power-item">
                  <div class="power-icon ki-icon">${CONFIG.ICONS.KI}</div>
                  <div class="power-label">Ki</div>
                  <div class="power-value">${this.character.ki}</div>
                </div>
                <div class="power-item">
                  <div class="power-icon max-ki-icon">${CONFIG.ICONS.MAX_KI}</div>
                  <div class="power-label">Max Ki</div>
                  <div class="power-value">${this.character.maxKi}</div>
                </div>
              </div>
            </div>

            <div class="character-detail-section">
              <h2 class="section-title">Descripción</h2>
              <div class="description-content">
                ${this.character.description}
              </div>
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
