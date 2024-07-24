/**
 * Selects a random element from the given array.
 *
 * @template T The type of elements in the array.
 * @param {T[]} array - The array from which to select a random element.
 * @returns {T} A random element from the array.
 * 
 * @example
 * // Selecting a random number from an array
 * const numbers = [1, 2, 3, 4, 5];
 * const randomNum = randomFrom(numbers);
 * console.log(randomNum); // Could log any number from the array
 * 
 * @example
 * // Selecting a random string from an array
 * const strings = ['apple', 'banana', 'cherry'];
 * const randomStr = randomFrom(strings);
 * console.log(randomStr); // Could log 'apple', 'banana', or 'cherry'
 * 
 * @example
 * // Using with async/await
 * async function example() {
 *   const items = ['item1', 'item2', 'item3'];
 *   const randomItem = randomFrom(items);
 *   console.log(randomItem); // Could log any string from the array
 * }
 * example();
 */
export function randomFrom<T>(array: T[]): T {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}
