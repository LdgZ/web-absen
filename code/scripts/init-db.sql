-- Simplified schema for local XAMPP development
CREATE TABLE IF NOT EXISTS teachers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS classes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  teacher_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  nisn VARCHAR(20),
  class_id INT NOT NULL,
  phone_parent VARCHAR(20),
  email_parent VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  class_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('hadir', 'sakit', 'izin', 'alpha') DEFAULT 'hadir',
  notes VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_attendance (student_id, date),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- Insert demo data
INSERT INTO teachers (email, password, name) VALUES 
('guru@sekolah.com', 'demo123', 'Bu Siti');

INSERT INTO classes (name, teacher_id) VALUES 
('1-A', 1),
('1-B', 1),
('2-A', 1),
('3-A', 1),
('4-A', 1),
('5-A', 1),
('6-A', 1);

INSERT INTO students (name, nisn, class_id, phone_parent) VALUES 
('Andi Wijaya', '0012345678', 1, '081234567890'),
('Budi Santoso', '0012345679', 1, '081234567891'),
('Citra Dewi', '0012345680', 1, '081234567892'),
('Dedi Hermawan', '0012345681', 1, '081234567893'),
('Eka Prasetya', '0012345682', 1, '081234567894'),
('Fitra Rahman', '0012345683', 2, '081234567895'),
('Gita Sari', '0012345684', 2, '081234567896');

CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_class ON attendance(class_id);
CREATE INDEX idx_students_class ON students(class_id);
