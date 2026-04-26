const mysql = require('mysql2/promise');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => { const m = envContent.match(new RegExp(`${key}="?([^"\\n]+)"?`)); return m ? m[1] : ''; };

async function debug() {
  try {
    const connection = await mysql.createConnection({
      host: getEnv('DB_HOST'),
      user: getEnv('DB_USER'),
      password: getEnv('DB_PASSWORD'),
      database: getEnv('DB_NAME'),
      port: parseInt(getEnv('DB_PORT') || '3306'),
      ssl: { rejectUnauthorized: false }
    });

    console.log('--- DATABASE DEBUG ---');
    
    // Check Students
    const [students] = await connection.execute('SELECT COUNT(*) as count FROM students');
    console.log('Total Students in DB:', students[0].count);

    // Check Classes
    const [classes] = await connection.execute('SELECT COUNT(*) as count FROM classes');
    console.log('Total Classes in DB:', classes[0].count);

    // Check Attendance today
    const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' });
    const [attendance] = await connection.execute('SELECT COUNT(*) as count FROM attendance WHERE date = ?', [today]);
    console.log(`Attendance records for ${today}:`, attendance[0].count);

    process.exit(0);
  } catch (err) {
    console.error('Debug failed:', err);
    process.exit(1);
  }
}

debug();
