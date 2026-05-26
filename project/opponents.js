export default [
    {
        id: 0,
        name: 'Basic Opponent',
        sprite: './assets/ghost/ghost (14).png',
        lootables: {
            min: 1,
            max: 3,
        },
        attack: {
            min: 1,
            max: 5,
        },
        defense: {
            min: 0,
            max: 3,
        },
        lives: 5,
    },
    {
        id: 1,
        name: 'Free 5 Points',
        sprite: './assets/ghost/ghost (42).png',
        lootables: {
            min: 5,
            max: 5,
        },
        attack: {
            min: 0,
            max: 0,
        },
        defense: {
            min: 0,
            max: 0,
        },
        lives: 0,
    },
];
