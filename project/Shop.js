import shopItems from './shopItems.js';
import Dialog from './Dialog.js';

export default class Shop extends Dialog {
    constructor() {
        super('#shop', '#shopBtn');
        this.currentCategory = 'weapons';
        this.gold = 0;
        this.ownedItems = JSON.parse(localStorage.getItem('ownedItems')) || {};
        this.depositedGold =
            parseInt(localStorage.getItem('depositedGold')) || 0;
        this.getPlayerBalance = null;
        this.setPlayerBalance = null;
        this.calculatePlayerStats = null;
        this.init();
    }

    setBalanceCallbacks(getBalance, setBalance) {
        this.getPlayerBalance = getBalance;
        this.setPlayerBalance = setBalance;
    }

    setStatCalculator(calculator) {
        this.calculatePlayerStats = calculator;
    }

    init() {
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

        const itemElement = document.createElement('div');
        itemElement.className = `shop-item ${isOwned ? 'owned' : ''}`;

        let statsHtml = '';
        if (item.damage) {
            statsHtml += `<span class="lucide-icon">sword</span> ${item.damage}`;
        }
        if (item.defense) {
            statsHtml += `<span class="lucide-icon">shield</span> ${item.defense}`;
        }

        itemElement.innerHTML = `
            <div class="shop-item-icon lucide-icon">${item.icon}</div>
            <div class="shop-item-name">${item.name}</div>
            <div class="rarity-badge ${item.rarity}">${item.rarity}</div>
            <div class="shop-item-description">${item.description}</div>
            ${statsHtml ? `<div class="shop-item-stats">${statsHtml}</div>` : ''}
            <div class="shop-item-price"><span class="lucide-icon">coins</span> ${item.price}</div>
            <button class="shop-item-buy ${isOwned ? 'owned' : ''}"
                    ${!canAfford && !isOwned ? 'disabled' : ''}>
                ${isOwned ? 'Owned' : 'Buy'}
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

        localStorage.setItem('ownedItems', JSON.stringify(this.ownedItems));

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
        this.ownedItems = JSON.parse(localStorage.getItem('ownedItems')) || {};
        this.depositedGold =
            parseInt(localStorage.getItem('depositedGold')) || 0;
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
        localStorage.setItem('depositedGold', this.depositedGold.toString());

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
        localStorage.setItem('depositedGold', '0');

        this.updateGoldDisplay();
    }
}
