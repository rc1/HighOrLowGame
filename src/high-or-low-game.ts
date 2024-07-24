/* eslint-disable max-classes-per-file */
import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AudioManager } from "./audio-manager.js";

const winnerImage = new URL('../../assets/winner.png', import.meta.url).href;
const loserImage = new URL('../../assets/loser.webp', import.meta.url).href;

enum Screen {
    Question,
    AnswerResult
}

enum QuestionResponse {
    High,
    Low
}

type GameState = {
    currentScore: number;
    highestScore: number;
    firstNote: string;
    secondNote: string;
    screen: Screen;
    isCorrect?: boolean;
    isPlayingNotes: boolean;
    hasPlayedNotes: boolean;
}

function createGameState(gameState?: Partial<GameState>): GameState {
    return {
        currentScore: 0,
        highestScore: 0,
        firstNote: "",
        secondNote: "",
        screen: Screen.Question,
        isPlayingNotes: false,
        hasPlayedNotes: false,
        ...gameState,
    };
}

function randomFrom<T>(array: T[]): T {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}

function withRandomNotes(gameState: GameState): GameState {
    const firstNote = randomFrom(AudioManager.noteKeys);
    let secondNote = randomFrom(AudioManager.noteKeys);
    while (secondNote === firstNote) {
        secondNote = randomFrom(AudioManager.noteKeys);
    }
    return { ...gameState, firstNote, secondNote };
}

function notesAscendInPitch(a: string, b: string): boolean {
    return AudioManager.noteFrequencies[a] < AudioManager.noteFrequencies[b];
}

@customElement("score-board")
class ScoreBoard extends LitElement {
    @property({ type: Object })
    gameState?: GameState;

    render() {
        return html`
            <div>
                <h2>Score</h2>
                <p>${this.gameState?.currentScore || "0"}</p>
            </div>
            <div>
                <h2>Highest</h2>
                <p>${this.gameState?.highestScore || "0"}</p>
            </div>
        `;
    }
}

@customElement("question-screen")
class QuestionScreen extends LitElement {
    @property({ type: Object })
    gameState: GameState | undefined;

    @property({ attribute: false })
    onAnswered?: ((withResponse: QuestionResponse) => void);

    @property({ attribute: false })
    onShouldPlay?: (() => void);

    private _makeHandleAnswer = (withResponse: QuestionResponse) => () => {
        this.onAnswered?.(withResponse);
    };

    private _handleAnswerHigh = this._makeHandleAnswer(QuestionResponse.High);

    private _handleAnswerLow = this._makeHandleAnswer(QuestionResponse.Low);

    private _handlePlay = () => {
        if (this.onShouldPlay) {
            this.onShouldPlay();
        }
    };

    render() {
        return html`
            <score-board .gameState=${this.gameState}></score-board>
            <div>
                <button ?disabled=${!this.gameState?.hasPlayedNotes} id='high-button' @click=${this._handleAnswerHigh}>♯</button>
                <button ?disabled=${!this.gameState?.hasPlayedNotes} id='low-button' @click=${this._handleAnswerLow}>♭</button>
            </div>
            <button ?disabled=${this.gameState?.isPlayingNotes} id='play-button' @click=${this._handlePlay}>Play</button>
        `;
    }
}

@customElement("answer-result-screen")
class AnswerResultScreen extends LitElement {
    static styles = css`
        :host {
            background-color: #FF1500;
            display: block;
        }

        :host([isCorrect]) {
            background-color: #51A200;
        }
    `;

    @property({type: Boolean, reflect: true})
    isCorrect = false;

    @property({ type: Object })
    gameState?: GameState;

    render() {
        return html`
            <score-board .gameState=${this.gameState}></score-board>
            <img alt="" src=${this.isCorrect ? winnerImage : loserImage} />
            <p>${this.isCorrect ? "Well done!" : "Try again!"}</p>
        `;
    }
}

@customElement("high-or-low-game")
class HighOrLowGame extends LitElement {

    @state()
    gameState: GameState = createGameState();

    private audioManager?:AudioManager;

    // I don't like this being a class method
    private _newRound() {
        const nextGameState = withRandomNotes(this.gameState);
        nextGameState.hasPlayedNotes = false;
        nextGameState.screen = Screen.Question;
        this.gameState = nextGameState;
    }

    private _handleShouldPlay = () => {
        const duration = 1;
        this.audioManager?.playNotesViaStream(this.gameState.firstNote, duration);
        this.gameState = {...this.gameState, isPlayingNotes:true };
        setTimeout(() => {
            this.audioManager?.playNotesViaStream(this.gameState.secondNote, duration);
            setTimeout(() => {
                this.gameState = {...this.gameState, isPlayingNotes:false, hasPlayedNotes:true };
            }, duration * 1000);
        }, duration * 1000);
    }

    private _handleAnswered = (withResponse: QuestionResponse) => {

        const isHigher = notesAscendInPitch(this.gameState.firstNote, this.gameState.secondNote);

        const isCorrect = (isHigher && withResponse === QuestionResponse.High) || (!isHigher && withResponse === QuestionResponse.Low);

        this.gameState = {
            ...this.gameState, 
            currentScore: isCorrect ? this.gameState.currentScore + 1 : 0,
            highestScore: Math.max(this.gameState.currentScore + 1, this.gameState.highestScore),
            isCorrect,
            screen: Screen.AnswerResult
        };

        setTimeout(() => {
            this._newRound();
        }, 1000);
    }

    connectedCallback() {
        super.connectedCallback();
        this._newRound();
        this.audioManager = new AudioManager();
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
    }

    render() {
        switch (this.gameState.screen) {
            case Screen.Question:
                return html`
                    <question-screen 
                        .gameState=${this.gameState}
                        .onAnswered=${this._handleAnswered}
                        .onShouldPlay=${this._handleShouldPlay}
                    ></question-screen>
                `;
            case Screen.AnswerResult:
                return html`
                    <answer-result-screen 
                        .gameState=${this.gameState}
                        .isCorrect=${this.gameState.isCorrect}
                    ></answer-result-screen>
                `;
            default:
                return html`<p>Unknown screen</p>`;
        }
    }
}
