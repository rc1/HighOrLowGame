/**
 * An object mapping musical note names to their frequencies in Hz.
 * 
 * @type {Record<string, number>}
 */
export const noteFrequencies: Record<string, number> = {
    'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63,
    'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00,
    'A#4': 466.16, 'B4': 493.88, 'C5': 523.25, 'C#5': 554.37, 'D5': 587.33,
    'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99,
    'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77
};

/**
 * An array of musical note names.
 * 
 * @type {string[]}
 */
export const noteNames = Object.keys(noteFrequencies);

/**
 * Compares the frequencies of two musical notes and returns true if the first note is lower in pitch than the second.
 * 
 * @param {string} a - The first note name.
 * @param {string} b - The second note name.
 * @returns {boolean} True if the frequency of the first note is lower than the frequency of the second note, otherwise false.
 * 
 * @example
 * // Compare notes
 * console.log(notesAscendInPitch('C4', 'D4')); // true
 */
export function notesAscendInPitch(a: string, b: string): boolean {
    return noteFrequencies[a] < noteFrequencies[b];
}

/**
 * Class to play musical notes using the Web Audio API.
 */
export class NotePlayer {
    private audioContext: AudioContext;

    /**
     * Creates an instance of NotePlayer.
     */
    constructor() {
        this.audioContext = new AudioContext();
    }

    /**
     * Plays a musical note for a specified duration via a stream.
     * 
     * @param {string} note - The name of the note to play.
     * @param {number} duration - The duration to play the note in seconds.
     * @returns {Promise<void>} A promise that resolves when the note has finished playing.
     * 
     * @example
     * // Create a NotePlayer instance and play a note using async/await
     * async function playNote() {
     *   const player = new NotePlayer();
     *   await player.playNotesViaStream('A4', 1);
     *   console.log('Note has finished playing');
     * }
     * playNote();
     */
    public async playNotesViaStream(note: string, duration: number): Promise<void> {
        const frequency = noteFrequencies[note];

        const stream = new ReadableStream({
            start(controller) {
                const sampleRate = 44100;
                const totalSamples = sampleRate * duration;
                const amplitude = 0.5;

                for (let i = 0; i < totalSamples; i++) {
                    const time = i / sampleRate;
                    const sample = amplitude * Math.sin(2 * Math.PI * frequency * time);
                    controller.enqueue(sample);
                }
                controller.close();
            }
        });

        const reader = stream.getReader();
        const audioBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const bufferData = audioBuffer.getChannelData(0);

        let offset = 0;
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            bufferData[offset++] = value;
        }

        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.audioContext.destination);

        return new Promise<void>((resolve) => {
            source.onended = () => resolve();
            source.start();
        });
    }
}
