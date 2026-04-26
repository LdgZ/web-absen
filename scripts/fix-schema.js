const mysql = require('mysql2/promise');
// Environment variables will be loaded via --env-file flag

async function fix() {
  const config = process.env.DATABASE_URL ? {
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  } : {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306'),
    ssl: { rejectUnauthorized: false }
  };

  console.log('Connecting to database...');
  const pool = mysql.createPool(config);
  
  try {
    const connection = await pool.getConnection();
    console.log('Connected.');

    console.log('Cleaning up duplicates...');
    // Delete older duplicates, keep the one with largest ID
    const [delResult] = await connection.execute(`
      DELETE a1 FROM attendance a1
      INNER JOIN attendance a2 
      WHERE a1.id < a2.id 
      AND a1.student_id = a2.student_id 
      AND a1.date = a2.date
    `);
    console.log('Duplicates cleaned:', delResult.affectedRows);

    console.log('Adding unique index...');
    try {
      await connection.execute('ALTER TABLE attendance ADD UNIQUE INDEX idx_student_date (student_id, date)');
      console.log('Unique index added.');
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME' || err.code === 'ER_DUP_INDEX') {
        console.log('Unique index already exists.');
      } else {
        throw err;
      }
    }
    
    connection.release();
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}
fix();
