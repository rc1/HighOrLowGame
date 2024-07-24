// import { map } from 'lit/directives/map.js';
// import { AudioManager } from './audio-manager.js';
// import { range } from 'lit/directives/range.js';
// import { customElement, property } from 'lit/decorators.js';
// import { html, LitElement } from 'lit';


// // I should keep this super simple for Bea and Felix.



// type AnswerResult = "correct" | "wrong" | "unanswered";

// type Answer = "higher" | "lower";

// type Notes = String[];

// type Round = {
//   notes: Notes;
//   answers: Answer[];
// }

// type App = {
//   newRound: () => void;
//   playSound: () => Promise<void>
//   answer: (answer: Answer) => AnswerResult;
// }

// function createApp() {
//   // Create an instance of AudioManager 
//   const audioManager = new AudioManager();


//   // (async () => { 
//   //   // Play two notes for a duration of 2 seconds
//   //   await audioManager.playNotesViaStream('C4', 'E4', 2);
//   //   await audioManager.playNotesViaStream('E4', 'E4', 2);

//   // })();

//   // // Get and log the list of allowed notes
//   // const allowedNotes = audioManager.getAllowedNotes();
//   // console.log('Allowed Notes:', allowedNotes);
// }


// @customElement("app-context")
// class AppContext extends LitElement {

//   // State

//   @property({ type: Boolean })
//   isPlayingAudio = false;

//   @property({ type: Number })
//   highestStreak = 0;

//   @property({ type: Object })
//   round: Round = createRandomRound(10);

//   static getEmptyRound(): Round {
//     return {
//       notes: [],
//       answers: []
//     };
//   }

//   // Properties

//   private audioManager: AudioManager | undefined;

//   // Actions

//   /**
//    * Plays the notes starting from the given index.
//    * 
//    * @param startIndex - The index from which to start playing the notes. Negative values play from the back
//    */
//   doPlayNotes(startIndex: Number) {
//     this.isPlaying = true;
//     while (true) {
//       await this.audioManager.playNote();
//     }
//     this.isPlaying = false;
//   }

//   answer(answer: Answer): AnswerResult {
//     // add the answer.
//     // if correct, wait a second and add a new round
//     // if wrong.
//     //    1. Add the answer
//     //    2. After two seconds, remove the answer

//     //return "correct";

//     // if correct
//     this.requestUpdate();
//   }

//   // Lit Element

//   connectedCallback() {
//     super.connectedCallback();
//     this.addEventListener('request-app-context-element', this._handleRequestTransparentElement);
//     this.audioManager = new AudioManager();
//   }

//   disconnectedCallback() {
//     this.removeEventListener('request-app-context-element', this._handleRequestTransparentElement);
//     super.disconnectedCallback();
//   }

//   _handleRequestTransparentElement(event) {
//     // Respond to the event with the reference to this element
//     event.detail.callback(this);
//   }


//   createRenderRoot() {
//     return this;
//   }

//   render() {
//     return html`<slot></slot>`;
//   }
// }


// function createRandomRound(numberOfNotes = 2): Round {

//   // Fill an array of notes, ensuring each is different
//   let lastValue: null | String = null;

//   const notes = Array.from({ length: 8 }, () => {
//     let nextValue = randomFrom(AudioManager.noteKeys);
//     while (nextValue === lastValue) {
//       nextValue = randomFrom(AudioManager.noteKeys);
//     }
//     lastValue = nextValue;
//     return nextValue;
//   });

//   return {
//     notes,
//     answers: []
//   }
// }


// function randomFrom(arr: any[]): any {
//   if (arr.length < 1) { return; }
//   return arr[Math.floor(Math.random() * arr.length)];
// }


// export default createApp;
