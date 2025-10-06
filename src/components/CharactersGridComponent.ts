import { Component } from './Component'
import { CharacterCardComponent } from './CharacterCardComponent'
import type { Character } from '../types/dragonball'

export class CharactersGridComponent extends Component {
  private characters: Character[]

  constructor(characters: Character[]) {
    super()
    this.characters = characters
  }

  updateCharacters(newCharacters: Character[]): void {
    this.characters = newCharacters
    this.update()
  }

  render(): string {
    return `
      <div class="characters-grid">
        ${this.characters.map(character => this.generateCharacterCard(character)).join('')}
      </div>
    `
  }

  private generateCharacterCard(character: Character): string {
    const cardComponent = new CharacterCardComponent(character)
    return cardComponent.render()
  }
}
