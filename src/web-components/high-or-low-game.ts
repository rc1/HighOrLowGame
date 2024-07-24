
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

export enum Screen {
    Question = "question",
    AnswerResult = "answer-result"
}

export enum QuestionResponse {
    High,
    Low
}

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
        screen: Screen.Question,
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
    nextGameState.screen = Screen.Question;
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

        const isCorrect = (isHigher && withResponse === QuestionResponse.High) || (!isHigher && withResponse === QuestionResponse.Low);

        const isHighScore = isCorrect && this.gameState.currentScore + 1 > this.gameState.highestScore;

        this.gameState = {
            ...this.gameState,
            currentScore: isCorrect ? this.gameState.currentScore + 1 : 0,
            highestScore: isCorrect ? Math.max(this.gameState.currentScore + 1, this.gameState.highestScore) : this.gameState.highestScore,
            isCorrect,
            screen: Screen.AnswerResult
        };

        if (this.shouldSpeak) {
            try {
                console.log("Will speak");
                await say(withResponse === QuestionResponse.High ? "Higher" : "Lower");
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

        // Wait for 4 seconds then trigger a screen change
        await wait(this.displayResultsForMs);
        this.gameState = makeNewRound(this.gameState!);
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
            case Screen.Question:
                return html`
                    <question-screen class="screen"
                        .gameState=${this.gameState}
                        .onAnswered=${this._handleAnswered}
                        .onShouldPlay=${this._handleShouldPlay}
                    ></question-screen>
                    <score-board .gameState=${this.gameState}></score-board>
                `;
            case Screen.AnswerResult:
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