import { html, fixture, expect } from '@open-wc/testing';
import type { AnswerResultScreen } from '../src/web-components/answer-result-screen.js';
import type { GameState } from '../src/web-components/high-or-low-game.js';
import '../src/web-components/answer-result-screen.js';

describe('AnswerResultScreen', () => {
    let element: AnswerResultScreen;

    beforeEach(async () => {
        element = await fixture(html`<answer-result-screen></answer-result-screen>`);
    });

    it('initializes with the correct default state', () => {
        expect(element.isCorrect).to.be.false;
        expect(element.gameState).to.be.undefined;
    });

    it('displays the correct message and image for a correct answer', async () => {
        element.isCorrect = true;
        await element.requestUpdate();

        const img = element.shadowRoot!.querySelector('img') as HTMLImageElement;
        const p = element.shadowRoot!.querySelector('p') as HTMLParagraphElement;

        expect(img.src).to.contain('winner.png');
        expect(p.textContent).to.equal('Well done!');
    });

    it('displays the correct message and image for an incorrect answer', async () => {
        element.isCorrect = false;
        await element.requestUpdate();

        const img = element.shadowRoot!.querySelector('img') as HTMLImageElement;
        const p = element.shadowRoot!.querySelector('p') as HTMLParagraphElement;

        expect(img.src).to.contain('loser.webp');
        expect(p.textContent).to.equal('Try again!');
    });

    it('renders correctly with a gameState', async () => {
        const gameState: GameState = {
            currentScore: 0,
            highestScore: 0,
            firstNote: 'C4',
            secondNote: 'E4',
            screen: 'answer-result',
            isCorrect: false,
            isPlayingNotes: false,
            hasPlayedNotes: false,
        };
        element.gameState = gameState;
        await element.requestUpdate();

        const img = element.shadowRoot!.querySelector('img') as HTMLImageElement;
        const p = element.shadowRoot!.querySelector('p') as HTMLParagraphElement;

        expect(img).to.exist;
        expect(p).to.exist;
    });

    it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible();
    });
});
