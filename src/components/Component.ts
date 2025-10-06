export abstract class Component {
  protected element: HTMLElement | null = null

  abstract render(): string

  mount(parent: HTMLElement): void {
    this.element = parent
    this.update()
  }

  update(): void {
    if (this.element) {
      this.element.innerHTML = this.render()
    }
  }

  unmount(): void {
    if (this.element) {
      this.element.innerHTML = ''
      this.element = null
    }
  }
}
