import { html, TemplateResult } from 'lit';
import { Story } from '@storybook/web-components';
import { GameState, createGameState } from '../src/web-components/high-or-low-game.js';
import '../src/web-components/score-board.js';

export default {
    title: 'ScoreBoard',
    component: 'score-board',
    argTypes: {
        gameState: { control: 'object' },
    },
};

interface ScoreBoardArgs {
    gameState: GameState;
}

const Template: Story<ScoreBoardArgs> = (args: ScoreBoardArgs): TemplateResult => html`
    <score-board .gameState=${args.gameState}></score-board>
`;

export const Default = Template.bind({});
Default.args = {
    gameState: createGameState({
        currentScore: 0,
        highestScore: 0,
    }),
};

export const WithScore = Template.bind({});
WithScore.args = {
    gameState: createGameState({
        currentScore: 5,
        highestScore: 10,
    }),
};
