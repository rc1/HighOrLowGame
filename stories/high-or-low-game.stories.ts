import { html, TemplateResult } from "lit";
import { Story } from "@storybook/web-components";
import { createGameState, GameState, Screen } from "../src/web-components/high-or-low-game.js";

export default {
  title: 'HighOrLowGame',
  component: 'high-or-low-game',
  argTypes: {
    gameState: { control: 'object' }
  },
};

interface HighOrLowGameArgs {
  gameState: GameState;
}

const Template: Story<HighOrLowGameArgs> = (args: HighOrLowGameArgs): TemplateResult => html`
    <high-or-low-game style="width: 300px; height: 600px;" gameState=${args.gameState}></high-or-low-game>
`;

export const Default = Template.bind({});
Default.args = {
  gameState: createGameState({
    currentScore: 0,
    highestScore: 0,
    firstNote: 'C4',
    secondNote: 'E4',
    screen: "question",
    isPlayingNotes: false,
    hasPlayedNotes: false,
  }),
};

export const AnswerResultScreen = Template.bind({});
AnswerResultScreen.args = {
  gameState: createGameState({
    currentScore: 1,
    highestScore: 2,
    firstNote: 'G4',
    secondNote: 'A4',
    screen: "answer-result",
    isPlayingNotes: false,
    hasPlayedNotes: true,
    isCorrect: true,
  }),
};
