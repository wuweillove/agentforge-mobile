#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const seedFile = path.join(__dirname, '../database/seed.sql');

async function seed() {
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('✓ Connected');

    console.log('\nCreating admin user...');
    
    // Hash admin password
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123!';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // Create admin user
    await client.query(
      `INSERT INTO users (email, password, name, subscription_tier)
       VALUES ($1, $2, $3, 'enterprise')
       ON CONFLICT (email) DO UPDATE
       SET password = $2, name = $3, subscription_tier = 'enterprise'`,
      [process.env.ADMIN_EMAIL || 'admin@agentforge.io', hashedPassword, 'Admin User']
    );
    console.log('✓ Admin user created/updated');
    console.log(`  Email: ${process.env.ADMIN_EMAIL || 'admin@agentforge.io'}`);
    console.log(`  Password: ${adminPassword}`);

    console.log('\nRunning seed data...');
    let seedSQL = fs.readFileSync(seedFile, 'utf8');
    
    // Replace password placeholders with hashed passwords
    const demoPassword = await bcrypt.hash('DemoPass123!', 10);
    seedSQL = seedSQL.replace(/\$2a\$10\$DemoHashedPassword[123]/g, demoPassword);
    
    await client.query(seedSQL);
    console.log('✓ Seed data inserted');

    // Display summary
    console.log('\nDatabase Summary:');
    const tables = [
      { name: 'users', label: 'Users' },
      { name: 'workflows', label: 'Workflows' },
      { name: 'credit_transactions', label: 'Credit Transactions' },
      { name: 'workflow_executions', label: 'Workflow Executions' },
    ];
    
    for (const table of tables) {
      const result = await client.query(`SELECT COUNT(*) FROM ${table.name}`);
      console.log(`  ${table.label}: ${result.rows[0].count}`);
    }

    console.log('\n✓ Seeding completed successfully!');
    console.log('\nTest Credentials:');
    console.log('  Admin: admin@agentforge.io / ' + adminPassword);
    console.log('  Demo: user1@example.com / DemoPass123!');
  } catch (error) {
    console.error('\n✗ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
