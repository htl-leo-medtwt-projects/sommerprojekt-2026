/**
 * Dialog class for managing modal dialogs
 */
export default class Dialog {
    dialog;
    close;
    trigger;

    /**
     * @param {string} dialogQuery - The CSS query of the dialog element
     * @param {string} triggerQuery - The CSS query of the trigger element
     * @param {string} closeQuery - The CSS query of the close button (optional, inside the dialog)
     */
    constructor(dialogQuery, triggerQuery, closeQuery = ".dialog-close") {
        this.dialog = document.querySelector(dialogQuery);
        if (!this.dialog) {
            throw new Error(`Dialog with query "${dialogQuery}" not found`);
        }

        this.close = this.dialog.querySelector(closeQuery);
        if (!this.close) {
            throw new Error(`Close button with query "${closeQuery}" not found in dialog`);
        }
        
        this.trigger = document.querySelector(triggerQuery);
        if (!this.trigger) {
            throw new Error(`Trigger with query "${triggerQuery}" not found`);
        }

        this.close.addEventListener("click", () => {
            this.dialog.close();
        });
        
        this.trigger.addEventListener("click", () => {
            this.dialog.showModal();
        });
    }
}