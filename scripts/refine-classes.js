const mysql = require('mysql2/promise');

async function refineClasses() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'sekolah_absensi'
    });

    console.log('Fetching classes...');
    const [classes] = await connection.execute('SELECT id, name FROM classes');
    
    if (!Array.isArray(classes)) {
      console.log('No classes found or error fetching.');
      return;
    }

    for (const cls of classes) {
      const originalName = cls.name;
      // Remove everything that is not a digit
      const refinedName = originalName.replace(/[^0-9]/g, '');
      
      if (refinedName && refinedName !== originalName) {
        console.log(`Updating class ${cls.id}: "${originalName}" -> "${refinedName}"`);
        await connection.execute('UPDATE classes SET name = ? WHERE id = ?', [refinedName, cls.id]);
      }
    }
    
    console.log('Refinement complete.');
    process.exit(0);
  } catch (err) {
    console.error('Error refining classes:', err);
    process.exit(1);
  }
}

refineClasses();
