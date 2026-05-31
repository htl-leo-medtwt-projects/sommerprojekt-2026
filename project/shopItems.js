export default {
    weapons: [
        {
            id: 'wooden_sword',
            name: 'Wooden Sword',
            description: 'A basic wooden sword. Better than nothing.',
            price: 50,
            damage: 2,
            icon: '⚔️',
            rarity: 'common'
        },
        {
            id: 'iron_sword',
            name: 'Iron Sword',
            description: 'A sturdy iron sword. Reliable and effective.',
            price: 150,
            damage: 5,
            icon: '🗡️',
            rarity: 'common'
        },
        {
            id: 'steel_blade',
            name: 'Steel Blade',
            description: 'A sharp steel blade. Cuts through armor.',
            price: 300,
            damage: 8,
            icon: '⚔️',
            rarity: 'uncommon'
        },
        {
            id: 'flame_sword',
            name: 'Flame Sword',
            description: 'A sword imbued with fire magic. Burns enemies.',
            price: 600,
            damage: 12,
            icon: '🔥',
            rarity: 'rare'
        },
        {
            id: 'dragon_slayer',
            name: 'Dragon Slayer',
            description: 'Legendary sword that can slay dragons.',
            price: 1200,
            damage: 20,
            icon: '🐉',
            rarity: 'legendary'
        }
    ],
    armor: [
        {
            id: 'leather_armor',
            name: 'Leather Armor',
            description: 'Basic leather protection. Light and flexible.',
            price: 40,
            defense: 2,
            icon: '🛡️',
            rarity: 'common'
        },
        {
            id: 'chain_mail',
            name: 'Chain Mail',
            description: 'Interlocked metal rings. Good protection.',
            price: 120,
            defense: 5,
            icon: '🔗',
            rarity: 'common'
        },
        {
            id: 'plate_armor',
            name: 'Plate Armor',
            description: 'Heavy metal plates. Excellent defense.',
            price: 250,
            defense: 8,
            icon: '🛡️',
            rarity: 'uncommon'
        },
        {
            id: 'magic_robe',
            name: 'Magic Robe',
            description: 'Enchanted robe that deflects spells.',
            price: 500,
            defense: 12,
            icon: '✨',
            rarity: 'rare'
        },
        {
            id: 'divine_armor',
            name: 'Divine Armor',
            description: 'Blessed armor with divine protection.',
            price: 1000,
            defense: 18,
            icon: '👼',
            rarity: 'legendary'
        }
    ],
    potions: [
        {
            id: 'health_potion_small',
            name: 'Small Health Potion',
            description: 'Restores 3 health points. One-time use.',
            price: 25,
            healAmount: 3,
            icon: '🧪',
            rarity: 'common',
            consumable: true
        },
        {
            id: 'health_potion_medium',
            name: 'Medium Health Potion',
            description: 'Restores 6 health points. One-time use.',
            price: 50,
            healAmount: 6,
            icon: '🧪',
            rarity: 'uncommon',
            consumable: true
        },
        {
            id: 'health_potion_large',
            name: 'Large Health Potion',
            description: 'Restores 10 health points. One-time use.',
            price: 100,
            healAmount: 10,
            icon: '🧪',
            rarity: 'rare',
            consumable: true
        },
        {
            id: 'strength_potion',
            name: 'Strength Potion',
            description: 'Temporarily increases damage by 5 for one battle.',
            price: 75,
            damageBoost: 5,
            icon: '💪',
            rarity: 'uncommon',
            consumable: true
        },
        {
            id: 'shield_potion',
            name: 'Shield Potion',
            description: 'Temporarily increases defense by 5 for one battle.',
            price: 75,
            defenseBoost: 5,
            icon: '🔰',
            rarity: 'uncommon',
            consumable: true
        },
        {
            id: 'luck_potion',
            name: 'Luck Potion',
            description: 'Increases chance of finding rare items.',
            price: 150,
            luckBoost: true,
            icon: '🍀',
            rarity: 'rare',
            consumable: true
        }
    ]
};
