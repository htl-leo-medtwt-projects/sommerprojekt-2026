import shopItems from './shopItems.js';
import Dialog from './Dialog.js';
import { readStore, writeStore } from './store.js';

export default class Shop extends Dialog {
    /**
     * @type {string} The current category of items being displayed
     */
    currentCategory = 'weapons';
    /**
     * @type {number} The amount of gold the player has
     */
    gold = 0;
    /**
     * @type {Object} The items the player has purchased
     */
    ownedItems;
    /**
     * @type {number} The amount of gold the player has deposited
     */
    depositedGold;
    /**
     * @type {Function} The function to get the player's current gold balance
     */
    getPlayerBalance = null;
    /**
     * @type {Function} The function to set the player's gold balance
     */
    setPlayerBalance = null;
    /**
     * @type {Function} The function to calculate the player's stats
     */
    calculatePlayerStats = null;

    constructor() {
        super('#shop', '#shopBtn');
        this.ownedItems = readStore('ownedItems') || {};
        this.depositedGold = readStore('depositedGold') ?? 0;

        const tabs = document.querySelectorAll('.shop-tab');
        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                tabs.forEach((t) => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentCategory = tab.dataset.category;
                this.renderShop();
            });
        });

        const depositBtn = document.getElementById('depositBtn');
        if (depositBtn) {
            depositBtn.addEventListener('click', () => this.depositGold());
        }

        const withdrawBtn = document.getElementById('withdrawBtn');
        if (withdrawBtn) {
            withdrawBtn.addEventListener('click', () => this.withdrawGold());
        }

        this.renderShop();
        this.updateGoldDisplay();
        this.renderOwnedItems();
    }

    setBalanceCallbacks(getBalance, setBalance) {
        this.getPlayerBalance = getBalance;
        this.setPlayerBalance = setBalance;
    }

    setStatCalculator(calculator) {
        this.calculatePlayerStats = calculator;
    }

    renderShop() {
        const shopItemsContainer = document.getElementById('shopItems');
        shopItemsContainer.innerHTML = '';

        const items = shopItems[this.currentCategory];
        items.forEach((item) => {
            const itemElement = this.createItemElement(item);
            shopItemsContainer.appendChild(itemElement);
        });
    }

    createItemElement(item) {
        const isOwned = this.ownedItems[item.id];
        const currentGold = this.getPlayerBalance
            ? this.getPlayerBalance()
            : this.gold;
        const canAfford = currentGold >= item.price;
        const isDisabled = isOwned || (!canAfford && !isOwned);

        const itemElement = document.createElement('div');
        itemElement.className = `shop-item ${isOwned ? 'owned' : ''}`;

        let statsHtml = '';
        if (item.damage) {
            statsHtml += `<span class="lucide-icon">sword</span> ${item.damage}`;
        }
        if (item.defense) {
            statsHtml += `<span class="lucide-icon">shield</span> ${item.defense}`;
        }
        if (item.consumable) {
            statsHtml += `<span class="lucide-icon">zap</span> Press [E] to use`;
        }

        let buttonLabel = 'Buy';
        if (isOwned) buttonLabel = item.consumable ? 'In Bag' : 'Owned';

        itemElement.innerHTML = `
            <div class="shop-item-icon lucide-icon">${item.icon}</div>
            <div class="shop-item-name">${item.name}</div>
            <div class="rarity-badge ${item.rarity}">${item.rarity}</div>
            <div class="shop-item-description">${item.description}</div>
            ${statsHtml ? `<div class="shop-item-stats">${statsHtml}</div>` : ''}
            <div class="shop-item-price"><span class="lucide-icon">coins</span> ${item.price}</div>
            <button class="shop-item-buy ${isOwned ? 'owned' : ''}"
                    ${isDisabled ? 'disabled' : ''}>
                ${buttonLabel}
            </button>
        `;

        const buyButton = itemElement.querySelector('.shop-item-buy');
        buyButton.addEventListener('click', () => this.buyItem(item));

        return itemElement;
    }

    buyItem(item) {
        const currentGold = this.getPlayerBalance
            ? this.getPlayerBalance()
            : this.gold;
        if (currentGold < item.price) {
            this.showMessage('Not enough gold!');
            return;
        }

        if (this.setPlayerBalance) {
            this.setPlayerBalance(currentGold - item.price);
        } else {
            this.gold -= item.price;
        }

        this.ownedItems[item.id] = true;

        writeStore('ownedItems', this.ownedItems);

        this.updateGoldDisplay();
        this.renderShop();
        this.renderOwnedItems();

        // Recalculate player stats after buying an item
        if (this.calculatePlayerStats) {
            this.calculatePlayerStats();
        }
    }

    updateGoldDisplay() {
        const goldDisplay = document.getElementById('goldAmount');
        const depositedDisplay = document.getElementById('depositedAmount');
        const currentGold = this.getPlayerBalance
            ? this.getPlayerBalance()
            : this.gold;
        goldDisplay.textContent = currentGold;
        if (depositedDisplay) {
            depositedDisplay.textContent = this.depositedGold;
        }
    }

    renderOwnedItems() {
        const ownedItemsContainer = document.getElementById('ownedItems');
        ownedItemsContainer.innerHTML = '';

        const ownedItemIds = Object.keys(this.ownedItems);
        if (ownedItemIds.length === 0) {
            ownedItemsContainer.innerHTML =
                '<p style="color: rgba(255,255,255,0.6);">No items yet</p>';
            return;
        }

        ownedItemIds.forEach((itemId) => {
            const item = this.findItemById(itemId);
            if (!item) return;

            const ownedItemElement = document.createElement('div');
            ownedItemElement.className = 'owned-item';
            ownedItemElement.innerHTML = `
                <span class="owned-item-icon lucide-icon">${item.icon}</span>
                <span class="owned-item-name">${item.name}</span>
            `;

            ownedItemsContainer.appendChild(ownedItemElement);
        });
    }

    findItemById(id) {
        for (const category of Object.keys(shopItems)) {
            const item = shopItems[category].find((i) => i.id === id);
            if (item) return item;
        }
        return null;
    }

    open() {
        super.open();
        this.ownedItems = readStore('ownedItems') || {};
        this.depositedGold = readStore('depositedGold') ?? 0;
        this.updateGoldDisplay();
        this.renderShop();
        this.renderOwnedItems();
        this.hideMessage();

        // Recalculate player stats when shop opens (in case items were added externally)
        if (this.calculatePlayerStats) {
            this.calculatePlayerStats();
        }
    }

    showMessage(message) {
        const messageElement = document.getElementById('shopMessage');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.classList.add('show');
            setTimeout(() => {
                this.hideMessage();
            }, 3000);
        }
    }

    hideMessage() {
        const messageElement = document.getElementById('shopMessage');
        if (messageElement) {
            messageElement.classList.remove('show');
        }
    }

    depositGold() {
        const currentGold = this.getPlayerBalance
            ? this.getPlayerBalance()
            : this.gold;
        if (currentGold <= 0) {
            this.showMessage('No gold to deposit!');
            return;
        }

        this.depositedGold += currentGold;
        writeStore('depositedGold', this.depositedGold);

        if (this.setPlayerBalance) {
            this.setPlayerBalance(0);
        } else {
            this.gold = 0;
        }

        this.updateGoldDisplay();
    }

    withdrawGold() {
        if (this.depositedGold <= 0) {
            this.showMessage('No deposited gold to withdraw!');
            return;
        }

        const currentGold = this.getPlayerBalance
            ? this.getPlayerBalance()
            : this.gold;
        const withdrawAmount = this.depositedGold;

        if (this.setPlayerBalance) {
            this.setPlayerBalance(currentGold + withdrawAmount);
        } else {
            this.gold += withdrawAmount;
        }

        this.depositedGold = 0;
        writeStore('depositedGold', 0);

        this.updateGoldDisplay();
    }
}
