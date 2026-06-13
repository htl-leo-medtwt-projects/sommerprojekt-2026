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
        name: 'the_crossing',
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
        name: 'frozen_tundra',
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
        name: 'winters_edge',
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
        name: 'the_ravine',
        string: `
            Gren/Plyr GrSu/None Gren/None Empt/None Empt/None Empt/None
            Gren/TreS GrDi/None Brdg/None Brdg/None Snow/None Snow/None
            Gren/None GrDi/None Empt/None Brdg/None Snow/None SnSu/None
            Empt/None Gren/None Empt/None Snow/None Snow/None Snow/None
            Empt/None Empt/None Empt/None Snow/Stne Snow/None SnPa/None
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
                    x: 5,
                    y: 4,
                },
            },
        ],
        opponents: [
            {
                type: 11,
                x: 2,
                y: 1,
            },
            {
                type: 3,
                x: 4,
                y: 1,
            },
            {
                type: 5,
                x: 3,
                y: 3,
            },
            {
                type: 8,
                x: 5,
                y: 2,
            },
        ],
    },
    {
        name: 'whispering_woods',
        string: `
            Gren/TreW Gren/Plyr GrSu/None Gren/None Gren/TreW Empt/None Empt/None
            Gren/TreS GrSu/None Gren/TreS Gren/None Gren/None Gren/None Gren/TreW
            Gren/None Gren/None Gren/None Gren/TreW GrSu/None Gren/None Gren/None
            Empt/None Gren/TreW Gren/None Gren/None Gren/None Gren/None Gren/Flr2
            Empt/None Empt/None Gren/TreS GrSu/None Gren/None GrDi/Lfdk Gren/Flr4
            Empt/None Empt/None Empt/None Gren/TreW GrDi/None Gren/None GrSu/None
        `,
        transfers: [
            {
                from: {
                    x: 1,
                    y: 0,
                },
            },
            {
                from: {
                    x: 6,
                    y: 4,
                },
            },
        ],
        opponents: [
            {
                type: 11,
                x: 3,
                y: 1,
            },
            {
                type: 1,
                x: 2,
                y: 2,
            },
            {
                type: 6,
                x: 4,
                y: 3,
            },
            {
                type: 7,
                x: 5,
                y: 3,
            },
        ],
    },
    {
        name: 'blizzard_wastes',
        string: `
            Empt/None Empt/None Snow/None SnRo/None Snow/TreW Snow/None SnSu/None Empt/None Empt/None
            Empt/None Snow/None SnSu/None Snow/None SnQu/None Snow/None Snow/None Snow/None Empt/None
            Brdg/Plyr Snow/None Snow/None SnRo/None Snow/None SnSu/None Snow/None SnQu/None Snow/None
            Empt/None Snow/None SnQu/None Snow/None Snow/None Snow/None SnRo/None Snow/None SnSu/None
            Empt/None SnPa/None Snow/None Snow/None SnSu/None Snow/None Snow/None Snow/None Snow/None
            Empt/None Snow/None Snow/TreW SnQu/None Snow/None SnRo/None Snow/None SnSu/None SnPa/None
            Empt/None Empt/None Empt/None Snow/None Snow/None Snow/None Snow/None Empt/None Empt/None
        `,
        transfers: [
            {
                from: {
                    x: 0,
                    y: 2,
                },
            },
            {
                from: {
                    x: 8,
                    y: 5,
                },
            },
        ],
        opponents: [
            {
                type: 9,
                x: 3,
                y: 2,
            },
            {
                type: 6,
                x: 2,
                y: 3,
            },
            {
                type: 8,
                x: 7,
                y: 1,
            },
            {
                type: 10,
                x: 6,
                y: 3,
            },
            {
                type: 9,
                x: 4,
                y: 4,
            },
        ],
    },
    {
        name: 'ancient_crypt',
        string: `
            Empt/None Wood/None GrSu/None Wood/None Empt/None
            Wood/Plyr Wood/None Wood/None Wood/None Wood/None
            Wood/None Wood/Stne Wood/None Wood/Stne Wood/None
            Wood/None Wood/None GrDi/None Wood/None Wood/None
            Wood/Stne Wood/None GrSu/None Wood/None Wood/Stne
            Wood/None Wood/None Wood/None Wood/None Wood/None
            Empt/None Wood/None GrDi/None Wood/None Wood/SgnX
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
                    y: 6,
                },
            },
        ],
        opponents: [
            {
                type: 12,
                x: 2,
                y: 1,
            },
            {
                type: 4,
                x: 4,
                y: 3,
            },
            {
                type: 13,
                x: 2,
                y: 5,
            },
            {
                type: 8,
                x: 0,
                y: 5,
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
                    x: 1,
                    y: 1,
                },
            },
        ],
        opponents: [],
    },
];
