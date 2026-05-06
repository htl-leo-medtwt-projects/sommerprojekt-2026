/**
 * StartButton class for managing the start button
 */
export default class StartButton {
    button;

    /**
     * @param {string} buttonQuery - The CSS query of the button element
     * @param {Function} callback - The callback function to be called when the button is clicked
     */
    constructor(buttonQuery, callback) {
        this.button = document.querySelector(buttonQuery);
        if (!this.button) {
            throw new Error(`Button with query "${buttonQuery}" not found`);
        }

        this.button.addEventListener('click', callback);
    }

    /**
     * Disables the button
     */
    disable() {
        this.button.disabled = true;
    }
}
