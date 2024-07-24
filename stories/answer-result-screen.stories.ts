import { html, TemplateResult } from 'lit';
import { Story } from '@storybook/web-components';
import { GameState, createGameState, Screen } from '../src/web-components/high-or-low-game.js';
import '../src/web-components/answer-result-screen.js';

export default {
  title: 'AnswerResultScreen',
  component: 'answer-result-screen',
  argTypes: {
    isCorrect: { control: 'boolean' },
    gameState: { control: 'object' },
  },
};

interface AnswerResultScreenArgs {
  isCorrect: boolean;
  gameState: GameState;
}

const Template: Story<AnswerResultScreenArgs> = (args: AnswerResultScreenArgs): TemplateResult => {
  return html`
    <answer-result-screen style="width: 300px; height: 600px;" .isCorrect=${args.isCorrect} .gameState=${args.gameState}></answer-result-screen>
  `;
};

export const CorrectAnswer = Template.bind({});
CorrectAnswer.args = {
  isCorrect: true,
  gameState: createGameState({
    currentScore: 5,
    highestScore: 10,
    firstNote: 'C4',
    secondNote: 'E4',
    screen: Screen.AnswerResult,
    isPlayingNotes: false,
    hasPlayedNotes: true,
    isCorrect: true,
  }),
};

export const IncorrectAnswer = Template.bind({});
IncorrectAnswer.args = {
  isCorrect: false,
  gameState: createGameState({
    currentScore: 5,
    highestScore: 10,
    firstNote: 'C4',
    secondNote: 'E4',
    screen: Screen.AnswerResult,
    isPlayingNotes: false,
    hasPlayedNotes: true,
    isCorrect: false,
  }),
};
