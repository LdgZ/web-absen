import mysql from 'mysql2/promise';

// Database Pool Configuration
let pool: mysql.Pool;

if (process.env.DATABASE_URL) {
  // Production (Aiven/Vercel)
  // mysql2.createPool can take a string, but to ensure SSL is set correctly:
  pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Force SSL for Aiven
    waitForConnections: true,
    connectionLimit: 5, // Lower limit for serverless environment
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  } as any);
} else {
  // Local (XAMPP)
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sekolah_absensi',
    port: parseInt(process.env.DB_PORT || '3306'),
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  });
}

export async function query(sql: string, values?: any[]) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, values);
    return results;
  } finally {
    connection.release();
  }
}

export const db = {
  // Students
  getStudent: async (id: string) => {
    const results = await query(
      'SELECT s.id, s.nisn, s.name, s.class_id, s.phone_parent FROM students s WHERE s.id = ?',
      [id]
    );
    if (!Array.isArray(results) || results.length === 0) return null;
    
    const r = results[0] as any;
    return {
      id: r.id?.toString(),
      nis: r.nisn || '',
      name: r.name || '',
      classId: r.class_id?.toString() || '',
      parentPhone: r.phone_parent || '',
    };
  },

  getAllStudents: async () => {
    return await query('SELECT s.*, c.name as className FROM students s LEFT JOIN classes c ON s.class_id = c.id');
  },

  getStudentsByClass: async (classId: string) => {
    return await query('SELECT * FROM students WHERE class_id = ?', [classId]);
  },

  createStudent: async (name: string, nisn: string, classId: string, phoneParent: string) => {
    const result = await query(
      'INSERT INTO students (name, nisn, class_id, phone_parent) VALUES (?, ?, ?, ?)',
      [name, nisn, classId, phoneParent]
    );
    return result;
  },

  updateStudent: async (id: string, data: any) => {
    const fields: string[] = [];
    const values: any[] = [];

    // Map frontend field names to DB column names
    if (data.nis !== undefined) {
      fields.push('nisn = ?');
      values.push(data.nis);
    }
    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.classId !== undefined) {
      fields.push('class_id = ?');
      values.push(data.classId);
    }
    if (data.parentPhone !== undefined) {
      fields.push('phone_parent = ?');
      values.push(data.parentPhone);
    }

    if (fields.length === 0) {
      return await db.getStudent(id);
    }

    values.push(id);
    await query(`UPDATE students SET ${fields.join(', ')} WHERE id = ?`, values);
    return await db.getStudent(id);
  },

  deleteStudent: async (id: string) => {
    await query('DELETE FROM students WHERE id = ?', [id]);
    return true;
  },

  // Attendance
  getAttendanceByDate: async (date: string, classId?: string) => {
    let sql = 'SELECT a.*, s.name as studentName FROM attendance a JOIN students s ON a.student_id = s.id WHERE a.date = ?';
    const values = [date];
    if (classId) {
      sql += ' AND a.class_id = ?';
      values.push(classId);
    }
    return await query(sql, values);
  },

  saveAttendance: async (studentId: string, classId: string, date: string, status: string) => {
    await query(
      'INSERT INTO attendance (student_id, class_id, date, status) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE status = VALUES(status)',
      [studentId, classId, date, status]
    );
    return true;
  },

  // Classes
  getAllClasses: async () => {
    return await query('SELECT * FROM classes');
  },

  getClass: async (id: string) => {
    const results = await query('SELECT * FROM classes WHERE id = ?', [id]);
    return Array.isArray(results) && results.length > 0 ? results[0] : null;
  },

  createClass: async (name: string, teacherId: number | null = 1) => {
    const result: any = await query(
      'INSERT INTO classes (name, teacher_id) VALUES (?, ?)',
      [name, teacherId]
    );
    return { id: result.insertId?.toString(), name, teacher_id: teacherId };
  },

  updateClass: async (id: string, name: string) => {
    await query('UPDATE classes SET name = ? WHERE id = ?', [name, id]);
    return await db.getClass(id);
  },

  deleteClass: async (id: string) => {
    await query('DELETE FROM classes WHERE id = ?', [id]);
    return true;
  },
};
