/**
 * Uses the Speech Synthesis API to speak the given words.
 * 
 * @param {string} words - The words to be spoken.
 * @returns {Promise<void>} A promise that resolves when the speech has finished,
 *                          or rejects if there is an error or if the Speech Synthesis API is not supported.
 * 
 * @example
 * // Basic usage with async/await
 * async function speakWords() {
 *   try {
 *     await say('Hello, world!');
 *     console.log('Speech finished');
 *   } catch (error) {
 *     console.error('Error during speech:', error);
 *   }
 * }
 * speakWords();
 * 
 * @example
 * // Handling unsupported API
 * async function speakWithFallback() {
 *   try {
 *     await say('This is a test');
 *     console.log('Speech finished');
 *   } catch (error) {
 *     if (error.message === 'Speech Synthesis API not supported') {
 *       console.error('Your browser does not support the Speech Synthesis API');
 *     } else {
 *       console.error('Error during speech:', error);
 *     }
 *   }
 * }
 * speakWithFallback();
 */
export function say(words: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (typeof SpeechSynthesisUtterance === "undefined" || typeof speechSynthesis === "undefined") {
            reject(new Error("Speech Synthesis API not supported"));
            return;
        }

        const utterance = new SpeechSynthesisUtterance(words);

        utterance.onend = () => resolve();
        utterance.onerror = (event) => reject(event.error);

        speechSynthesis.speak(utterance);
    });
}
