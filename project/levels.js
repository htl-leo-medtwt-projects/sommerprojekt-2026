export default [
    {
        name: 'home',
        string: `
            GrSu/Plyr Gren/Path Empt/None
            Gren/Shop Gren/Path Wood/None
            Gren/Flr2 Gren/SgnR Empt/None
        `,
        transfers: [
            {
                from: {
                    x: 2,
                    y: 1,
                },
            },
        ],
        opponents: [
            {
                type: 0,
                x: 1,
                y: 1,
            },
        ],
    },
    {
        name: 'level1',
        string: `
            Gren/Plyr Gren/None Gren/TreW Gren/None Gren/None
            GrDi/None GrDi/Lfdk Wood/None Gren/None Gren/Stne
            GrSu/None Gren/None Snow/None Empt/None Empt/None
            Gren/Flr4 Snow/None Snow/None Brdg/None SnPa/None
            Gren/TreS SnQu/None SnRo/None Empt/None SnSu/None
        `,
        transfers: [
            {
                from: {
                    x: 0,
                    y: 0,
                },
            },
            {
                from: {
                    x: 4,
                    y: 4,
                },
            },
        ],
        opponents: [
            {
                type: 3,
                x: 0,
                y: 2,
            },
            {
                type: 5,
                x: 3,
                y: 3,
            },
        ],
    },
    {
        name: 'level2',
        string: `
            Empt/None Empt/None Empt/None Snow/None Snow/None Snow/None Empt/None Empt/None
            Empt/None Empt/None Snow/None Snow/SgnR Snow/None Snow/None Snow/None Empt/None
            Empt/None Snow/None SnRo/None SnSu/None Snow/None SnRo/None Snow/None Wood/None
            Brdg/Plyr SnSu/None Snow/None Snow/None Snow/Path SnSu/None Snow/None Snow/None
            Empt/None Snow/None Snow/None Snow/Spar Snow/None Snow/Path SnRo/None Snow/None
            Empt/None Snow/None Snow/Path Snow/None SnPa/Path Snow/None SnSu/None Snow/None
            Empt/None Empt/None Snow/None SnQu/None SnSu/None Snow/None Snow/None Empt/None
            Empt/None Empt/None Empt/None Snow/None Snow/None Snow/None Empt/None Empt/None
        `,
        transfers: [
            {
                from: {
                    x: 0,
                    y: 3,
                },
            },
            {
                from: {
                    x: 7,
                    y: 2,
                },
            },
        ],
        opponents: [
            {
                type: 5,
                x: 2,
                y: 2,
            },
            {
                type: 3,
                x: 4,
                y: 1,
            },
            {
                type: 6,
                x: 5,
                y: 4,
            },
            {
                type: 2,
                x: 6,
                y: 6,
            },
        ],
    },
    {
        name: 'level3',
        string: `
            Empt/None Gren/Path Gren/None Gren/None Snow/None Snow/None Empt/None
            Wood/Plyr Gren/Path Gren/None Gren/None Gren/None Snow/None Snow/None
            Empt/None Gren/Flr4 Gren/None Gren/None Snow/TreW Snow/None SnPa/None
            Empt/None Gren/Flr2 Gren/Flr4 Snow/None Snow/None SnQu/None SnPa/None
            Empt/None Empt/None Empt/None Empt/None SnPa/None Empt/None Empt/None
        `,
        transfers: [
            {
                from: {
                    x: 0,
                    y: 1,
                },
            },
            {
                from: {
                    x: 4,
                    y: 4,
                },
            },
        ],
        opponents: [
            {
                type: 4,
                x: 5,
                y: 1,
            },
            {
                type: 7,
                x: 6,
                y: 3,
            },
            {
                type: 3,
                x: 3,
                y: 2,
            },
        ],
    },
    {
        name: 'portal_home',
        string: `
            Gren/Plyr Gren/Path
            Gren/Path Wood/SgnX
        `,
        transfers: [
            {
                from: {
                    x: 2,
                    y: 2,
                },
            },
        ],
        opponents: [],
    },
];
