// import { LitElement, html, css } from 'lit';
// import { property, customElement } from 'lit/decorators.js';
// import createApp  from "./app.js"

// const logo = new URL('../../assets/open-wc-logo.svg', import.meta.url).href;

// @customElement('high-or-low')
// export class HighOrLow extends LitElement {
//   @property({ type: String }) 
//   header = 'My app';

//   @property({ type: Boolean})
//   hasStarted = false;

//   static styles = css`
//     :host {
//       min-height: 100vh;
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       justify-content: flex-start;
//       font-size: calc(10px + 2vmin);
//       color: #1a2b42;
//       max-width: 960px;
//       margin: 0 auto;
//       text-align: center;
//       background-color: var(--high-or-low-background-color);
//     }

//     main {
//       flex-grow: 1;
//     }

//     .logo {
//       margin-top: 36px;
//       animation: app-logo-spin infinite 20s linear;
//     }

//     @keyframes app-logo-spin {
//       from {
//         transform: rotate(0deg);
//       }
//       to {
//         transform: rotate(360deg);
//       }
//     }

//     .app-footer {
//       font-size: calc(12px + 0.5vmin);
//       align-items: center;
//     }

//     .app-footer a {
//       margin-left: 5px;
//     }
//   `;

//   connectedCallback() {
//     super.connectedCallback();
//   }

//   disconnectedCallback(): void {
//     super.disconnectedCallback();
//   }

//   handleButtonClick():void {
//     console.log("Starting");
//     const app = createApp();
//     this.hasStarted = true;
//   }

//   render() {
//     return html`
//       <main>
//         <app-header></app-header>
//         <div class="logo"><img alt="open-wc logo" src=${logo} /></div>
//         <h1>${this.header}</h1>

//         <p>Edit <code>src/HighOrLow.ts</code> and save to reload.</p>
//         <a
//           class="app-link"
//           href="https://open-wc.org/guides/developing-components/code-examples"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Code examples
//         </a>
//         ${ !this.hasStarted ? html`<button @click="${this.handleButtonClick}">Start</button>` : html`<p>Running</p>` }
//       </main>

//       <p class="app-footer">
//         🚽 Made with love by
//         <a
//           target="_blank"
//           rel="noopener noreferrer"
//           href="https://github.com/open-wc"
//           >open-wc</a
//         >.
//       </p>
//     `;
//   }
// }
