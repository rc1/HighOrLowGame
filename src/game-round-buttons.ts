import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('game-round-buttons')
class GameRoundButtons extends LitElement {
  @property({ type: Boolean })
  hasChosenHigh = false;

  @property({ type: Boolean })
  hasChosenLow = false;

  handleHighSelected(): void {
    const event = new CustomEvent('high-selected', {
      detail: { message: 'Button was clicked!' },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  handleLowSelected(): void {
    const event = new CustomEvent('low-selected', {
      detail: { message: 'Button was clicked!' },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    return html`<div>
      <button @click=${this.handleHighSelected}></button>
      <button ?disabled=${!this.hasChosenHigh && !this.hasChosenLow}>
        Play
      </button>
      <button @click=${this.handleLowSelected}></button>
    </div>`;
  }
}
