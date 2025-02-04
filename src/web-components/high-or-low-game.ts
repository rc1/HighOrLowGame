
import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { NotePlayer, notesAscendInPitch, noteNames } from "../utils/note-player.js";
import { randomFrom } from "../utils/random-from.js";
import "./answer-result-screen.js";
import "./score-board.js";
import "./question-screen.js";
import { sharedStyles } from "../styles.js";
import wait from "../utils/wait.js";
import { say } from "../utils/say.js";

export type Screen = "question" | "answer-result";

export type QuestionResponse = "high" | "low";

export type GameState = {
    currentScore: number;
    highestScore: number;
    firstNote: string;
    secondNote: string;
    screen: Screen;
    isCorrect: boolean;
    isPlayingNotes: boolean;
    hasPlayedNotes: boolean;
}

export function createGameState(gameState?: Partial<GameState>): GameState {
    return {
        currentScore: 0,
        highestScore: 0,
        firstNote: "",
        secondNote: "",
        isCorrect: false,
        screen: "question",
        isPlayingNotes: false,
        hasPlayedNotes: false,
        ...gameState,
    };
}

function withRandomNotes(gameState: GameState): GameState {
    const firstNote = randomFrom(noteNames);
    let secondNote = randomFrom(noteNames);
    while (secondNote === firstNote) {
        secondNote = randomFrom(noteNames);
    }
    return { ...gameState, firstNote, secondNote };
}

export function makeNewRound(gameState: GameState): GameState {
    const nextGameState = withRandomNotes(gameState!);
    nextGameState.hasPlayedNotes = false;
    nextGameState.screen = "question";
    return nextGameState;
}

@customElement("high-or-low-game")
export class HighOrLowGame extends LitElement {

    static styles = [
        sharedStyles,
        css`
            :host {
                display: block;
                position: relative;
                background-color: white;
            }

            .screen {
                width: 100%;
                height: 100%;
            }

            score-board {
                position: absolute;
                top: 13px;
                left: 13px;
                right: 13px;
            }
        `
    ]

    @property({ type: Number })
    displayResultsForMs = 2000;

    @property({ type: Boolean })
    shouldSpeak = true;

    @state()
    gameState?: GameState;

    private notePlayer?: NotePlayer;

    private _handleShouldPlay = async () => {
        this.gameState = { ...this.gameState!, isPlayingNotes: true };
        await this.notePlayer!.playNotesViaStream(this.gameState!.firstNote, 1);
        await this.notePlayer!.playNotesViaStream(this.gameState!.secondNote, 1);
        this.gameState = { ...this.gameState, isPlayingNotes: false, hasPlayedNotes: true };
    }

    private _handleAnswered = async (withResponse: QuestionResponse) => {
        if (!this.gameState) { return; }

        const isHigher = notesAscendInPitch(this.gameState.firstNote, this.gameState.secondNote);

        const isCorrect = (isHigher && withResponse === "high") || (!isHigher && withResponse === "low");

        const isHighScore = isCorrect && this.gameState.currentScore + 1 > this.gameState.highestScore;

        this.gameState = {
            ...this.gameState,
            currentScore: isCorrect ? this.gameState.currentScore + 1 : 0,
            highestScore: isCorrect ? Math.max(this.gameState.currentScore + 1, this.gameState.highestScore) : this.gameState.highestScore,
            isCorrect,
            screen: "answer-result"
        };

        if (this.shouldSpeak) {
            try {
                await say(withResponse === "high" ? "Higher" : "Lower");
                await wait(666);
                await say(isCorrect ? "Well Done!" : "Try Again!");
                if (isHighScore) {
                    await say("New High Score!");
                }
                if (isCorrect) {
                    await say(`${this.gameState.currentScore} point${this.gameState.currentScore > 1 ? "s" : ""}`);
                }
            } catch (error) {
                const err = error as Error;
                if (err.message !== 'Speech Synthesis API not supported') {
                    throw error;
                }
            }
        }

        await wait(this.displayResultsForMs);
        this.gameState = makeNewRound(this.gameState!);

        if (typeof umami !== "undefined") {
            umami.track('answered');
            umami.track(isCorrect ? "correct" : "wrong");
            if (isHighScore) {
                umami.track(`highscore`, {score: this.gameState.highestScore});
            }
        }
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this.gameState) {
            this.gameState = makeNewRound(createGameState());
        }
        this.notePlayer = new NotePlayer();
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
    }

    render() {
        if (!this.gameState) { return ""; }

        switch (this.gameState.screen) {
            case "question":
                return html`
                    <question-screen class="screen"
                        .gameState=${this.gameState}
                        .onAnswered=${this._handleAnswered}
                        .onShouldPlay=${this._handleShouldPlay}
                    ></question-screen>
                    <score-board .gameState=${this.gameState}></score-board>
                `;
            case "answer-result":
                return html`
                    <answer-result-screen class="screen"
                        .gameState=${this.gameState}
                        .isCorrect=${this.gameState.isCorrect}
                    ></answer-result-screen>
                    <score-board .gameState=${this.gameState}></score-board>
                `;
            default:
                return html`<p>Unknown screen</p>`;
        }
    }
}
