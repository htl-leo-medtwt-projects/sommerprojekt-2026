/**
 * Dialog class for managing modal dialogs
 */
export default class Dialog {
    /**
     * @type {HTMLDialogElement} The dialog element
     */
    dialog;
    /**
     * @type {HTMLButtonElement} The close button element
     */
    closeButton;
    /**
     * @type {HTMLButtonElement} The trigger (open) button element
     */
    trigger;

    /**
     * @param {string} dialogQuery - The CSS query of the dialog element
     * @param {string} triggerQuery - The CSS query of the trigger (open) button element
     * @param {string} closeQuery - The CSS query of the close button
     */
    constructor(dialogQuery, triggerQuery, closeQuery = '.dialog-close') {
        this.dialog = document.querySelector(dialogQuery);
        if (!this.dialog) {
            throw new Error(`Dialog with query "${dialogQuery}" not found`);
        }

        this.closeButton = this.dialog.querySelector(closeQuery);
        if (!this.closeButton) {
            throw new Error(
                `Close button with query "${closeQuery}" not found in dialog`,
            );
        }

        this.trigger = document.querySelector(triggerQuery);
        if (!this.trigger) {
            throw new Error(`Trigger with query "${triggerQuery}" not found`);
        }

        this.closeButton.addEventListener('click', () => {
            this.close()
        });

        this.trigger.addEventListener('click', () => {
            this.open();
        });
    }

    /**
     * Opens the dialog
     */
    open() {
        this.dialog.showModal();
    }

    /**
     * Closes the dialog
     */
    close() {
        this.dialog.close();
    }
}
