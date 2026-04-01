/**
 * Dialog class for managing modal dialogs
 */
export default class Dialog {
    dialog;
    close;
    trigger;

    /**
     * @param {string} id - The id of the dialog element
     * @param {string} triggerId - The id of the trigger element
     */
    constructor(id, triggerId) {
        this.dialog = document.getElementById(id);
        if (!this.dialog) {
            throw new Error(`Dialog with id "${id}" not found`);
        }

        if (!triggerId) {
            throw new Error(`Trigger id not provided`);
        }

        this.close = this.dialog.querySelector(".dialog-close");
        this.close.addEventListener("click", () => {
            this.dialog.close();
        });
        
        this.trigger = document.getElementById(triggerId);
        if (this.trigger) {
            this.trigger.addEventListener("click", () => {
                this.dialog.showModal();
            });
        }
    }
}