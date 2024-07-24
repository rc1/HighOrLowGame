import { html, TemplateResult } from 'lit';
import { Story } from '@storybook/web-components';
import { GameState, createGameState, Screen, QuestionResponse } from '../src/web-components/high-or-low-game.js';
import '../src/web-components/question-screen.js';

export default {
    title: 'QuestionScreen',
    component: 'question-screen',
    argTypes: {
        gameState: { control: 'object' },
        onAnswered: { action: 'answered' },
        onShouldPlay: { action: 'shouldPlay' },
    },
};

interface QuestionScreenArgs {
    gameState: GameState;
    onAnswered: (withResponse: QuestionResponse) => void;
    onShouldPlay: () => void;
}

const Template: Story<QuestionScreenArgs> = (args: QuestionScreenArgs): TemplateResult => {
    return html`
    <question-screen style="display: block; width:300px; height: 600px;" .gameState=${args.gameState} .onAnswered=${args.onAnswered} .onShouldPlay=${args.onShouldPlay}></question-screen>
  `;
};

export const Default = Template.bind({});
Default.args = {
    gameState: createGameState({
        currentScore: 0,
        highestScore: 0,
        firstNote: 'C4',
        secondNote: 'E4',
        screen: Screen.Question,
        isPlayingNotes: false,
        hasPlayedNotes: false,
    }),
    onAnswered: (response: QuestionResponse) => console.log('Answered:', response),
    onShouldPlay: () => console.log('Should Play'),
};

export const WithPlayedNotes = Template.bind({});
WithPlayedNotes.args = {
    gameState: createGameState({
        currentScore: 5,
        highestScore: 10,
        firstNote: 'C4',
        secondNote: 'E4',
        screen: Screen.Question,
        isPlayingNotes: false,
        hasPlayedNotes: true,
    }),
    onAnswered: (response: QuestionResponse) => console.log('Answered:', response),
    onShouldPlay: () => console.log('Should Play'),
};

export const PlayingNotes = Template.bind({});
PlayingNotes.args = {
    gameState: createGameState({
        currentScore: 5,
        highestScore: 10,
        firstNote: 'C4',
        secondNote: 'E4',
        screen: Screen.Question,
        isPlayingNotes: true,
        hasPlayedNotes: false,
    }),
    onAnswered: (response: QuestionResponse) => console.log('Answered:', response),
    onShouldPlay: () => console.log('Should Play'),
};
