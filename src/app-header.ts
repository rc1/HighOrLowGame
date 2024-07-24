import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

@customElement('app-header')
export class AppHeader extends LitElement {
    @property({ type: String }) title = 'High or Low';

    static styles = css`
        h1 {
            font-size: 28px;
        }
    `;


    render() {
    return html`
        <h1>${this.title}</h1>
    `;
    }

}