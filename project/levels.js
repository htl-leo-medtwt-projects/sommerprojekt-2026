export default [
    {
        name: 'home',
        string: `
            GrSu/Plyr Gren/Path Empt/None
            Gren/Flr4 Gren/Path Wood/None
            Gren/Flr2 Gren/SgnR Empt/None
        `,
        transfers: [
            {
                from: {
                    x: 0,
                    y: 1,
                },
                to: {
                    level: 'level1',
                    x: 0,
                    y: 0,
                },
            },
            {
                from: {
                    x: 1,
                    y: 0,
                },
                to: {
                    level: 'level1',
                    x: 0,
                    y: 0,
                },
            },
            {
                from: {
                    x: 1,
                    y: 2,
                },
                to: {
                    level: 'level1',
                    x: 0,
                    y: 0,
                },
            },
            {
                from: {
                    x: 2,
                    y: 1,
                },
                to: {
                    level: 'level1',
                    x: 0,
                    y: 0,
                },
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
    },
];
