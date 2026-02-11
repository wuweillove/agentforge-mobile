#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const schemaFile = path.join(__dirname, '../database/schema.sql');

async function migrate() {
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('✓ Connected');

    console.log('\nRunning migrations...');
    const schema = fs.readFileSync(schemaFile, 'utf8');
    
    await client.query(schema);
    console.log('✓ Schema created/updated successfully');

    // Get table counts
    const tables = ['users', 'subscriptions', 'credits', 'workflows'];
    console.log('\nTable Status:');
    
    for (const table of tables) {
      const result = await client.query(`SELECT COUNT(*) FROM ${table}`);
      console.log(`  ${table}: ${result.rows[0].count} rows`);
    }

    console.log('\n✓ Migration completed successfully!');
  } catch (error) {
    console.error('\n✗ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
