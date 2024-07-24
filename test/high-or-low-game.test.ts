import { html, fixture, expect } from '@open-wc/testing';
import type { HighOrLowGame } from '../src/web-components/high-or-low-game.js';
import { Screen, QuestionResponse, makeNewRound } from '../src/web-components/high-or-low-game.js';
import '../src/web-components/high-or-low-game.js';
import wait from '../src/utils/wait.js';

describe('HighOrLowGame', () => {
    let element: HighOrLowGame;
    const displayAnswersFor = 10;

    beforeEach(async () => {
        element = await fixture(html`<high-or-low-game .shouldSpeak=${false} displayResultsForMs=${displayAnswersFor} ></high-or-low-game>`);
    });

    it('initializes with the correct default state', () => {
        expect(element.gameState).to.exist;
        expect(element.gameState!.currentScore).to.equal(0);
        expect(element.gameState!.highestScore).to.equal(0);
        expect(element.gameState!.screen).to.equal('question'); 
        expect(element.gameState!.isPlayingNotes).to.be.false;
        expect(element.gameState!.hasPlayedNotes).to.be.false;
    });

    it('starts a new round correctly', () => {
        element.gameState = makeNewRound(element.gameState!);
        expect(element.gameState!.firstNote).to.not.equal('');
        expect(element.gameState!.secondNote).to.not.equal('');
        expect(element.gameState!.screen).to.equal('question'); 
        expect(element.gameState!.hasPlayedNotes).to.be.false;
    });

    it('handles should play correctly', async () => {
        element['_handleShouldPlay']();
        await new Promise(r => setTimeout(r, 0)); // wait for the event loop to update state
        expect(element.gameState!.isPlayingNotes).to.be.true;
    });

    it('renders the question screen correctly', async () => {
        element.gameState!.screen = Screen.Question;
        await element.requestUpdate();
        const questionScreen = element.shadowRoot!.querySelector('question-screen')!;
        expect(questionScreen).to.exist;
    });

    it('renders the answer result screen correctly', async () => {
        element.gameState!.screen = Screen.AnswerResult;
        await element.requestUpdate();
        const answerResultScreen = element.shadowRoot!.querySelector('answer-result-screen')!;
        expect(answerResultScreen).to.exist;
    });

    it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible();
    });

    it('handles answer correctly', async () => {
        element.gameState = {
            currentScore: 0,
            highestScore: 0,
            firstNote: 'C4',
            secondNote: 'E4',
            screen: Screen.Question,
            isCorrect: false,
            isPlayingNotes: false,
            hasPlayedNotes: true,
        };
        await element.requestUpdate();
        element['_handleAnswered'](QuestionResponse.High);
        await wait(displayAnswersFor + 10);
        expect(element.gameState!.screen).to.equal('question'); // Should reset to question
    });

    it('updates gameState when connected', async () => {
        const el:HighOrLowGame = await fixture(html`<high-or-low-game .gameState=${{
            currentScore: 10,
            highestScore: 20,
            firstNote: 'D4',
            secondNote: 'G4',
            screen: Screen.Question, 
            isPlayingNotes: false,
            hasPlayedNotes: false,
        }}></high-or-low-game>`);
        expect(el.gameState!.currentScore).to.equal(10);
        expect(el.gameState!.highestScore).to.equal(20);
    });
});
