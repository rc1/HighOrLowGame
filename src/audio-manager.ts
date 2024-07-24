// AudioManager.ts
export class AudioManager {
    private audioContext: AudioContext;

    static noteFrequencies:{[key: string]: number } = {
        'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63,
        'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00,
        'A#4': 466.16, 'B4': 493.88, 'C5': 523.25, 'C#5': 554.37, 'D5': 587.33,
        'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99,
        'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77
    };

    static noteKeys = Object.keys(AudioManager.noteFrequencies);

    static noteToFrequency(note: string): number {
        return AudioManager.noteFrequencies[note] || 0;
    }

    constructor() {
        this.audioContext = new AudioContext();
    }

    public async playNotesViaStream(note: string, duration: number): Promise<void> {
        const frequency = AudioManager.noteToFrequency(note);

        if (frequency === 0 ) {
            console.error("Invalid note provided.");
            return;
        }

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
        source.start();
    }

    public playNotes(note1: string, note2: string, duration: number): void {
        const frequency1 = AudioManager.noteToFrequency(note1);
        const frequency2 = AudioManager.noteToFrequency(note2);

        if (frequency1 === 0 || frequency2 === 0) {
            console.error("Invalid note provided.");
            return;
        }

        const now = this.audioContext.currentTime;

        const oscillator1 = this.audioContext.createOscillator();
        oscillator1.frequency.setValueAtTime(frequency1, now);
        oscillator1.type = 'sine';

        const oscillator2 = this.audioContext.createOscillator();
        oscillator2.frequency.setValueAtTime(frequency2, now);
        oscillator2.type = 'sine';

        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0.1, now);

        oscillator1.connect(gainNode).connect(this.audioContext.destination);
        oscillator2.connect(gainNode).connect(this.audioContext.destination);

        oscillator1.start(now);
        oscillator2.start(now);
        oscillator1.stop(now + duration);
        oscillator2.stop(now + duration);

        console.log("Should be playing nores");
    }

    public getAllowedNotes(): string[] {
        return Object.keys(AudioManager.noteFrequencies);
    }
}
