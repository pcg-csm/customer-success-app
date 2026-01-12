export const customers = [
    {
        id: 1,
        company: 'TechNova',
        name: 'Alice Johnson',
        email: 'alice@technova.com',
        phone: '555-0101',
        status: 'Live',
        active: true,
        licensedProducts: ['Shopfloor', 'Quality'],
        pcgSupportPocId: 3, // Gerry Dewil
        pcgImplementationLeadId: 1, // Jim Sorbello
        pcgSalesPocId: 4, // Mike Lobue
        pcgProjectPocId: 2, // Stephen Trull
        signedDate: '2023-01-15',
        terms: 24, // months
        netsuite: {
            sandboxVersion: '2024.1',
            sandboxUrl: 'https://system.netsuite.com/app/center/card.nl?sc=-29&ts=123',
            productionVersion: '2023.2',
            productionUrl: 'https://system.na1.netsuite.com/app/center/card.nl?sc=-29&ts=456'
        },
        tulip: {
            accountUrl: 'https://technova.tulip.co',
            appVersion: 'r234',
            workstations: 45
        },
        customerTeam: [
            { firstName: 'Alice', lastName: 'Johnson', email: 'alice@technova.com', role: 'Champion' },
            { firstName: 'David', lastName: 'Miller', email: 'david@technova.com', role: 'IT Manager' },
            { firstName: 'Sarah', lastName: 'Lee', email: 'sarah@technova.com', role: 'Quality Lead' }
        ],
        activityLog: [
            { id: 1, timestamp: '2024-03-01T09:00:00', content: 'Initial project kickoff meeting. Discussed timeline and deliverables.' },
            { id: 2, timestamp: '2024-03-05T14:30:00', content: 'Received signed contract via email.' }
        ],
        arr: '$120,000',
        joined: '2023-01-15'
    },
    {
        id: 2,
        company: 'Quantum Corp',
        name: 'Bob Smith',
        email: 'bob@quantum.com',
        phone: '555-0202',
        status: 'Onboarding',
        active: true,
        licensedProducts: ['Shopfloor'],
        pcgSupportPocId: 6,
        pcgImplementationLeadId: 5,
        pcgSalesPocId: 4,
        pcgProjectPocId: 2,
        signedDate: '2023-11-20',
        terms: 12, // months
        netsuite: {
            sandboxVersion: '2024.1',
            sandboxUrl: 'https://system.netsuite.com/app/center/card.nl?sc=-29&ts=789',
            productionVersion: '2024.1',
            productionUrl: 'https://system.na1.netsuite.com/app/center/card.nl?sc=-29&ts=012'
        },
        tulip: {
            accountUrl: 'https://quantum.tulip.co',
            appVersion: 'r240',
            workstations: 12
        },
        arr: '$85,000',
        joined: '2023-11-20'
    },
    {
        id: 3,
        company: 'Nebula Stream',
        name: 'Charlie Davis',
        email: 'charlie@nebula.com',
        phone: '555-0303',
        status: 'Live',
        active: false,
        licensedProducts: ['Scheduler'],
        pcgSupportPocId: 3,
        pcgImplementationLeadId: 1,
        pcgSalesPocId: 4,
        pcgProjectPocId: 2,
        signedDate: '2022-08-05',
        terms: 12, // months
        netsuite: {
            sandboxVersion: '2023.1',
            sandboxUrl: 'https://system.netsuite.com/app/center/card.nl?sc=-29&ts=333',
            productionVersion: '2023.1',
            productionUrl: 'https://system.na1.netsuite.com/app/center/card.nl?sc=-29&ts=444'
        },
        tulip: {
            accountUrl: 'https://nebula.tulip.co',
            appVersion: 'r220',
            workstations: 5
        },
        arr: '$45,000',
        joined: '2022-08-05'
    }
];
