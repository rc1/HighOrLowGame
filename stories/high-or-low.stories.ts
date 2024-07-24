import { html, TemplateResult } from 'lit';
import '../src/high-or-low.js';

export default {
  title: 'HighOrLow',
  component: 'high-or-low',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  header?: string;
  backgroundColor?: string;
}

const Template: Story<ArgTypes> = ({ header, backgroundColor = 'white' }: ArgTypes) => html`
  <high-or-low style="--high-or-low-background-color: ${backgroundColor}" .header=${header}></high-or-low>
`;

export const App = Template.bind({});
App.args = {
  header: 'My app',
};
