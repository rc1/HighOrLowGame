import { html, fixture, expect } from '@open-wc/testing';
import '../src/web-components/score-board.js'; // import the score-board component
import type { ScoreBoard } from '../src/web-components/score-board.js'; // import type for ScoreBoard
import type { GameState } from '../src/web-components/high-or-low-game.js'; // import type for GameState

describe('ScoreBoard', () => {
    let element: ScoreBoard;

    beforeEach(async () => {
        element = await fixture(html`<score-board></score-board>`);
    });

    it('initializes with no gameState', () => {
        expect(element.gameState).to.be.undefined;
    });

    it('displays default scores when gameState is not provided', async () => {
        await element.updateComplete; // wait for update to complete
        const score = element.shadowRoot!.querySelector('p')!;
        expect(score).to.exist;
        expect(score.textContent).to.equal('0');
    });

    it('renders current score and highest score correctly', async () => {
        const gameState: GameState = {
            currentScore: 5,
            highestScore: 10,
            firstNote: '',
            secondNote: '',
            screen: 'question',
            isCorrect: false,
            isPlayingNotes: false,
            hasPlayedNotes: false,
        };
        element.gameState = gameState;
        await element.updateComplete; // wait for update to complete

        const scoreElements = element.shadowRoot!.querySelectorAll('p');
        expect(scoreElements.length).to.equal(2);
        expect(scoreElements[0].textContent).to.equal('5'); // current score
        expect(scoreElements[1].textContent).to.equal('10'); // highest score
    });

    it('displays updated scores when gameState changes', async () => {
        const initialState: GameState = {
            currentScore: 2,
            highestScore: 4,
            firstNote: '',
            secondNote: '',
            screen: 'question',
            isCorrect: false,
            isPlayingNotes: false,
            hasPlayedNotes: false,
        };
        element.gameState = initialState;
        await element.updateComplete; // wait for update to complete

        const updatedState: GameState = {
            ...initialState,
            currentScore: 8,
            highestScore: 15,
        };
        element.gameState = updatedState;
        await element.updateComplete; // wait for update to complete

        const scoreElements = element.shadowRoot!.querySelectorAll('p');
        expect(scoreElements[0].textContent).to.equal('8'); // current score
        expect(scoreElements[1].textContent).to.equal('15'); // highest score
    });

    it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible();
    });
});
