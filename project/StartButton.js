/**
 * StartButton class for managing the start button
 */
export default class StartButton {
    constructor(buttonQuery, callback) {
        this.button = document.querySelector(buttonQuery);
        if (!this.button) {
            throw new Error(`Button with query "${buttonQuery}" not found`);
        }

        this.button.addEventListener("click", callback);
    }
}