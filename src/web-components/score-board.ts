import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { GameState } from "./high-or-low-game.js";
import { sharedStyles } from "../styles.js";

@customElement("score-board")
export class ScoreBoard extends LitElement {

    static styles = [
        sharedStyles,
        css`
            :host {
                display: flex;
                justify-content: space-between;
                pointer-events: none;
                color: #000;
            }

            h2, p {
                pointer-events: all;
            }

            h2 {
                text-transform: uppercase;
            }

            p {
                font-size: 36px;
                line-height: 36px;
            }

            .highest * {
                text-align: right;
            }
        `
    ]

    @property({ type: Object })
    gameState?: GameState;

    render() {
        return html`
            <div>
                <h2>Score</h2>
                <p>${this.gameState?.currentScore || "0"}</p>
            </div>
            <div class="highest">
                <h2>Highest</h2>
                <p>${this.gameState?.highestScore || "0"}</p>
            </div>
        `;
    }
}