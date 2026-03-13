const mysql = require('mysql2/promise');

async function run() {
  console.log("Connecting to DB...");
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sekolah_absensi'
  });

  console.log("Truncating attendance...");
  await connection.execute('TRUNCATE TABLE attendance');
  
  console.log("Deleting students...");
  await connection.execute('DELETE FROM students');
  
  console.log("Deleting classes...");
  await connection.execute('DELETE FROM classes');
  
  console.log("Inserting new classes 1-6...");
  await connection.execute(`
    INSERT INTO classes (name, teacher_id) VALUES 
      ('1-A', 1),
      ('1-B', 1),
      ('2-A', 1),
      ('3-A', 1),
      ('4-A', 1),
      ('5-A', 1),
      ('6-A', 1)
  `);
  
  console.log("Done");
  process.exit(0);
}

run().catch(console.error);
