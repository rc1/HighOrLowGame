import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { GameState } from "./high-or-low-game.js";
import { QuestionResponse } from "./high-or-low-game.js";
import { sharedStyles } from "../styles.js";

@customElement("question-screen")
export class QuestionScreen extends LitElement {

    static styles = [
        sharedStyles,
        css`
            :host {
                display: block;
                position: relative;
            }

            button {
                all: unset;
                text-align: center;
                cursor: pointer;
                filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
            }

            button:disabled {
                cursor: not-allowed;
                filter: none;
            }

            .answer {
                display: block;
                position: absolute;
                width: 296px;

                top: calc(50% - (296px/2)); /* Lazy calcs... but quite hacks to make it look less bad. */
                left: calc(50% - (296px/2));

                font-size: 64px;
                line-height: 64px;

                &.high {
                    top: calc(50% - 300px);
                    bottom: 50%;
                    padding-bottom: calc(296px/2);

                    border-radius: 100% 100% 0 0;

                    background-color: #64d0ff34;
                    transition: background-color 0.2s ease-in;

                    &:not(:disabled) {
                        opacity: 1;
                        background-color: #64D1FFFF;
                    }
                }

                &.low {
                    top: 50%;
                    bottom: calc(50% - 300px);
                    padding-top: calc(296px/2);

                    background-color: rgba(7, 255, 106, 0.2);
                    transition: background-color 0.2s ease-in;

                    border-radius: 0 0 100% 100%;

                    &:not(:disabled) {
                        background-color: rgba(7, 255, 106, 0.67);
                    }
                }
            }

            @keyframes heartbeat {
            0% {
                    transform: scale(1);
                }
                20% {
                    transform: scale(1.2);
                }
                40% {
                    transform: scale(1);
                }
                60% {
                    transform: scale(1.2);
                }
                80% {
                    transform: scale(1);
                }
                100% {
                    transform: scale(1);
                }
            }

            .play {
                width: 296px;
                height: 296px;
                position: absolute;
                top:calc(50% - (296px/2));
                left:calc(50% - (296px/2));
                background-color: #27B660;
                border-radius: 2000px;

                &.isPlaying svg {
                    animation: heartbeat 1s infinite;
                }

                svg {
                    padding-left: 40px;
                }
            }
        `
    ]

    @property({ type: Object })
    gameState: GameState | undefined;

    @property({ attribute: false })
    onAnswered?: ((withResponse: QuestionResponse) => void);

    @property({ attribute: false })
    onShouldPlay?: (() => void);

    private _makeHandleAnswer = (withResponse: QuestionResponse) => () => {
        this.onAnswered?.(withResponse);
        if (typeof umami !== "undefined") {
            umami.track('answered');
        }
    };

    private _handleAnswerHigh = this._makeHandleAnswer(QuestionResponse.High);

    private _handleAnswerLow = this._makeHandleAnswer(QuestionResponse.Low);

    private _handlePlay = () => {
        if (this.onShouldPlay) {
            this.onShouldPlay();
        }
        if (typeof umami !== "undefined") {
            umami.track('play-sound');
        }
    };

    render() {
        return html`
            <button class="answer high" ?disabled=${!this.gameState?.hasPlayedNotes} @click=${this._handleAnswerHigh}>♯</button>
            <button class="answer low" ?disabled=${!this.gameState?.hasPlayedNotes} @click=${this._handleAnswerLow}>♭</button>
            <button title="play" class=${`play${this.gameState?.isPlayingNotes ? " isPlaying" : ""}`} ?disabled=${this.gameState?.isPlayingNotes} @click=${this._handlePlay}>
                <svg width="120" height="140" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M120 70L-6.52533e-06 139.282L-4.68497e-07 0.717959L120 70Z" fill="white"/>
                </svg>
            </button>
        `;
    }
}