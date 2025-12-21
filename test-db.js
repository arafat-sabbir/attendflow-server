const { Client } = require('pg');

async function testConnection(password) {
    const client = new Client({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: password,
        database: 'postgres', // Try connecting to default postgres db first
    });

    try {
        await client.connect();
        console.log(`✅ Success with password: ${password}`);
        await client.end();
        return true;
    } catch (err) {
        console.log(`❌ Failed with password: ${password} - ${err.message}`);
        return false;
    }
}

async function run() {
    await testConnection('arafat');
    await testConnection('fatiha');
    await testConnection('admin123@');
    await testConnection('postgres');
    await testConnection('');
    await testConnection('root');
    await testConnection('password');
    await testConnection('01632029032');
}

run();
