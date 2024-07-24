import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { GameState } from "./high-or-low-game.js";
import { sharedStyles } from "../styles.js";

const winnerImage = new URL("../../../assets/winner.png", import.meta.url).href;
const loserImage = new URL('../../../assets/loser.webp', import.meta.url).href;

@customElement("answer-result-screen")
export class AnswerResultScreen extends LitElement {
    static styles = [
        sharedStyles,
        css`
            :host {
                /* background-color: #FF1500; */
                display: block
            }

            :host([isCorrect]) {
                /* background-color: #51A200; */
            }

            div {
                height: 100%;
                width: 100%;
                text-align: center;
                display: flex;
                justify-content: space-evenly;
                flex-direction: column;
            }

            img {
                width: calc(min(100% - 40px, 355px));
                border-radius: 10px;
                margin-left: calc((100% - min(100% - 40px, 355px))/2);
            }

            p {
                color: black;
                font-size: 48px;
            }
        `
    ]

    @property({ type: Boolean, reflect: true })
    isCorrect = false;

    @property({ type: Object })
    gameState?: GameState;

    render() {
        return html`
            <div>
                <img alt="" src=${this.isCorrect ? winnerImage : loserImage} />
                <p>${this.isCorrect ? "Well done!" : "Try again!"}</p>
            </div>
        `;
    }
}