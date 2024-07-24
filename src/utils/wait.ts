/**
 * Waits for a specified duration before resolving the returned promise.
 * Optionally, provides a mechanism to cancel the wait using an AbortController.
 * 
 * @param {number} duration - The duration to wait in milliseconds.
 * @param {AbortSignal} [signal] - An optional AbortSignal to cancel the wait.
 * @returns {Promise<void>} A promise that resolves after the specified duration,
 *                          or earlier if the signal is aborted.
 * 
 * @example
 * // Basic usage with async/await
 * async function example() {
 *   await wait(1000);
 *   console.log('Waited for 1 second');
 * }
 * example();
 * 
 * @example
 * // With cancellation using async/await
 * async function exampleWithCancel() {
 *   const controller = new AbortController();
 *   const signal = controller.signal;
 *   
 *   setTimeout(() => controller.abort(), 2000); // Cancel after 2 seconds
 *   
 *   try {
 *     await wait(5000, signal);
 *     console.log('Wait completed');
 *   } catch (e) {
 *     if (e.name === 'AbortError') {
 *       console.log('Wait was cancelled');
 *     } else {
 *       throw e;
 *     }
 *   }
 * }
 * exampleWithCancel();
 */
export default function wait(duration: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
        const timeoutHandle = setTimeout(resolve, duration);

        if (signal) {
            signal.addEventListener('abort', () => {
                clearTimeout(timeoutHandle);
                reject(new DOMException('Aborted', 'AbortError'));
            }, { once: true });
        }
    });
}
