import shopItems from './shopItems.js';
import Dialog from './Dialog.js';

export default class Shop extends Dialog {
    constructor() {
        super('#shop', '#shopBtn');
        this.currentCategory = 'weapons';
        this.gold = 100;
        this.ownedItems = JSON.parse(localStorage.getItem('ownedItems')) || {};
        this.getPlayerBalance = null;
        this.setPlayerBalance = null;
        this.init();
    }

    setBalanceCallbacks(getBalance, setBalance) {
        this.getPlayerBalance = getBalance;
        this.setPlayerBalance = setBalance;
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
        if (item.healAmount) {
            statsHtml += `<span class="lucide-icon">heart</span> +${item.healAmount}`;
        }
        if (item.damageBoost) {
            statsHtml += `<span class="lucide-icon">arm-flex</span> +${item.damageBoost}`;
        }
        if (item.defenseBoost) {
            statsHtml += `<span class="lucide-icon">shield</span> +${item.defenseBoost}`;
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
                ${isOwned ? (item.consumable ? 'Buy More' : 'Owned') : 'Buy'}
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
            alert('Not enough gold!');
            return;
        }

        if (this.setPlayerBalance) {
            this.setPlayerBalance(currentGold - item.price);
        } else {
            this.gold -= item.price;
        }

        if (item.consumable) {
            this.ownedItems[item.id] = (this.ownedItems[item.id] || 0) + 1;
        } else {
            this.ownedItems[item.id] = true;
        }

        localStorage.setItem('ownedItems', JSON.stringify(this.ownedItems));

        this.updateGoldDisplay();
        this.renderShop();
        this.renderOwnedItems();
    }

    updateGoldDisplay() {
        const goldDisplay = document.getElementById('goldAmount');
        const currentGold = this.getPlayerBalance
            ? this.getPlayerBalance()
            : this.gold;
        goldDisplay.textContent = currentGold;
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

            const count = this.ownedItems[itemId];
            const isConsumable = item.consumable;

            const ownedItemElement = document.createElement('div');
            ownedItemElement.className = 'owned-item';
            ownedItemElement.innerHTML = `
                <span class="owned-item-icon lucide-icon">${item.icon}</span>
                <span class="owned-item-name">${item.name}</span>
                ${isConsumable ? `<span class="owned-item-count">${count}</span>` : ''}
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
        this.updateGoldDisplay();
        this.renderShop();
        this.renderOwnedItems();
    }
}
