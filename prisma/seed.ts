import prisma from '../src/app/config/prisma';
import bcrypt from 'bcrypt';

async function main() {
    console.log('Seeding database...');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
        where: { email: 'admin@example.com' },
    });

    if (existingAdmin) {
        console.log('Admin user already exists');
        return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.create({
        data: {
            email: 'admin@example.com',
            name: 'Super Admin',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('Created admin user:', admin.email);
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
