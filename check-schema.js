
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function check() {
  const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306'),
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
  };

  const connection = await mysql.createConnection(config);
  try {
    console.log('--- SHOW INDEX FROM attendance ---');
    const [indexes] = await connection.execute('SHOW INDEX FROM attendance');
    console.table(indexes.map(idx => ({
      Table: idx.Table,
      Non_unique: idx.Non_unique,
      Key_name: idx.Key_name,
      Column_name: idx.Column_name
    })));

    const hasUnique = indexes.some(idx => 
      idx.Key_name !== 'PRIMARY' && 
      idx.Non_unique === 0 && 
      (idx.Column_name === 'student_id' || idx.Column_name === 'date')
    );

    if (!hasUnique) {
      console.log('\n❌ Missing unique constraint on (student_id, date).');
      console.log('Adding unique index now...');
      await connection.execute('ALTER TABLE attendance ADD UNIQUE INDEX idx_student_date (student_id, date)');
      console.log('✅ Unique index added successfully.');
    } else {
      console.log('\n✅ Unique constraint on (student_id, date) already exists.');
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await connection.end();
  }
}

check();
