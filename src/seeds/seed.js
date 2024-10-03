require('dotenv').config(); 

const prisma = require('../config/db');

async function main() {
    await prisma.user.createMany({
        data: [
            { name: 'Test One', email: 'testone@example.com', password: 'password123' },
            { name: 'Teste Two', email: 'testtwo@example.com', password: 'password123' },
        ],
    });
    console.log('Database seeded');
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
