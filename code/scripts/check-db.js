const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sekolah_absensi'
  });
  const [rows] = await connection.execute('SELECT * FROM classes');
  console.log('Classes:', rows);
  process.exit(0);
}
run();
