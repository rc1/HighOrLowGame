import { html, fixture, expect } from '@open-wc/testing';
import type { QuestionScreen } from '../src/web-components/question-screen.js';
import type { GameState, QuestionResponse } from '../src/web-components/high-or-low-game.js';
import '../src/web-components/question-screen.js';

describe('QuestionScreen', () => {
    let element: QuestionScreen;

    beforeEach(async () => {
        element = await fixture(html`<question-screen></question-screen>`);
    });

    it('initializes with the correct default state', () => {
        expect(element.gameState).to.be.undefined;
    });

    it('renders the high and low buttons correctly', async () => {
        const gameState: GameState = {
            currentScore: 0,
            highestScore: 0,
            firstNote: 'C4',
            secondNote: 'E4',
            screen: 'question',
            isCorrect: false,
            isPlayingNotes: false,
            hasPlayedNotes: false,
        };
        element.gameState = gameState;
        await element.requestUpdate();

        const highButton = element.shadowRoot!.querySelector('.answer.high') as HTMLButtonElement;
        const lowButton = element.shadowRoot!.querySelector('.answer.low') as HTMLButtonElement;
        
        expect(highButton).to.exist;
        expect(lowButton).to.exist;
        expect(highButton.disabled).to.be.true;
        expect(lowButton.disabled).to.be.true;

        gameState.hasPlayedNotes = true;
        element.gameState = gameState;
        await element.requestUpdate();

        expect(highButton.disabled).to.be.false;
        expect(lowButton.disabled).to.be.false;
    });

    it('handles the play button click correctly', async () => {
        let wasCalled = false;
        element.onShouldPlay = () => { wasCalled = true; };

        const playButton = element.shadowRoot!.querySelector('.play') as HTMLButtonElement;
        playButton.click();

        expect(wasCalled).to.be.true;
    });

    it('handles the high button click correctly', async () => {
        let response: QuestionResponse | null = null;
        element.onAnswered = (res: QuestionResponse) => { response = res; };

        const gameState: GameState = {
            currentScore: 0,
            highestScore: 0,
            firstNote: 'C4',
            secondNote: 'E4',
            screen: 'question',
            isCorrect: false,
            isPlayingNotes: false,
            hasPlayedNotes: true,
        };
        element.gameState = gameState;
        await element.requestUpdate();

        const highButton = element.shadowRoot!.querySelector('.answer.high') as HTMLButtonElement;
        highButton.click();

        expect(response).to.equal('high');
    });

    it('handles the low button click correctly', async () => {
        let response: QuestionResponse | null = null;
        element.onAnswered = (res: QuestionResponse) => { response = res; };

        const gameState: GameState = {
            currentScore: 0,
            highestScore: 0,
            firstNote: 'C4',
            secondNote: 'E4',
            screen: 'question',
            isCorrect: false,
            isPlayingNotes: false,
            hasPlayedNotes: true,
        };
        element.gameState = gameState;
        await element.requestUpdate();

        const lowButton = element.shadowRoot!.querySelector('.answer.low') as HTMLButtonElement;
        lowButton.click();

        expect(response).to.equal('low');
    });

    it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible();
    });
});
