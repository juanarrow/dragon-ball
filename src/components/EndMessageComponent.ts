import { Component } from './Component'

export class EndMessageComponent extends Component {
  private isVisible: boolean = false

  setVisible(visible: boolean): void {
    this.isVisible = visible
    this.update()
  }

  render(): string {
    const hiddenClass = this.isVisible ? '' : 'hidden'
    return `
      <div id="end-message" class="end-message ${hiddenClass}">
        <p>¡Has visto todos los personajes disponibles!</p>
      </div>
    `
  }
}
