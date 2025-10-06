import { Component } from './Component'

export class HeaderComponent extends Component {
  render(): string {
    return `
      <h1 class="main-title">
        Personajes de Dragon Ball
      </h1>
    `
  }
}
