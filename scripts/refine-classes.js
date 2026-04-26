const mysql = require('mysql2/promise');
const fs = require('fs');

// Read env from .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => { const m = envContent.match(new RegExp(`${key}="?([^"\n]+)"?`)); return m ? m[1] : ''; };
const host = getEnv('DB_HOST');
const user = getEnv('DB_USER');
const password = getEnv('DB_PASSWORD');
const database = getEnv('DB_NAME');
const port = parseInt(getEnv('DB_PORT') || '3306');

async function refineClasses() {
  try {
    const connection = await mysql.createConnection({
      host, user, password, database, port,
      ssl: { rejectUnauthorized: false }
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
