# API Documentation

Daftar lengkap API endpoints yang tersedia.

## Authentication

### Login
\`\`\`
POST /api/auth/login
Content-Type: application/json

{
  "email": "guru@sekolah.com",
  "password": "demo123"
}

Response:
{
  "success": true,
  "teacher": {
    "id": 1,
    "name": "Guru Demo",
    "email": "guru@sekolah.com"
  }
}
\`\`\`

### Logout
\`\`\`
POST /api/auth/logout

Response:
{
  "success": true
}
\`\`\`

## Dashboard

### Get Statistics
\`\`\`
GET /api/dashboard/stats

Response:
{
  "totalStudents": 7,
  "presentToday": 6,
  "sickToday": 1,
  "alphaToday": 0,
  "attendancePercentage": "85.7",
  "weeklyData": [
    {
      "day": "2024-01-15",
      "hadir": 6,
      "sakit": 1,
      "alpha": 0
    }
  ]
}
\`\`\`

## Students

### Get All Students
\`\`\`
GET /api/students

Response:
[
  {
    "id": 1,
    "name": "Andi Wijaya",
    "nisn": "0012345678",
    "class_id": 1,
    "className": "X-A",
    "phone_parent": "081234567890",
    "created_at": "2024-01-15T10:00:00.000Z"
  }
]
\`\`\`

### Create Student
\`\`\`
POST /api/students
Content-Type: application/json

{
  "name": "Siswa Baru",
  "nisn": "0099999999",
  "class_id": 1,
  "phone_parent": "08123456789"
}

Response:
{
  "id": 8,
  "name": "Siswa Baru",
  "nisn": "0099999999",
  "class_id": 1,
  "phone_parent": "08123456789"
}
\`\`\`

### Update Student
\`\`\`
PUT /api/students/1
Content-Type: application/json

{
  "name": "Andi Wijaya Updated",
  "phone_parent": "081234567891"
}

Response:
{
  "id": 1,
  "name": "Andi Wijaya Updated",
  "nisn": "0012345678",
  "class_id": 1,
  "className": "X-A",
  "phone_parent": "081234567891"
}
\`\`\`

### Delete Student
\`\`\`
DELETE /api/students/1

Response:
{
  "success": true
}
\`\`\`

## Attendance

### Get Today's Attendance
\`\`\`
GET /api/attendance/today/1

Response:
[
  {
    "id": 1,
    "name": "Andi Wijaya",
    "nisn": "0012345678",
    "class_id": 1,
    "className": "X-A",
    "status": "hadir",
    "phone_parent": "081234567890"
  }
]
\`\`\`

### Save Attendance
\`\`\`
POST /api/attendance/save
Content-Type: application/json

{
  "classId": 1,
  "date": "2024-01-15",
  "records": [
    {
      "studentId": 1,
      "status": "hadir"
    },
    {
      "studentId": 2,
      "status": "sakit"
    },
    {
      "studentId": 3,
      "status": "alpha"
    }
  ]
}

Response:
{
  "success": true,
  "message": "Absensi tersimpan"
}
\`\`\`

## Classes

### Get All Classes
\`\`\`
GET /api/classes

Response:
[
  {
    "id": 1,
    "name": "X-A",
    "teacher_id": 1,
    "created_at": "2024-01-15T10:00:00.000Z"
  }
]
\`\`\`

## Reports

### Get Class Report
\`\`\`
GET /api/reports/1?month=2024-01

Response:
{
  "totalDays": 15,
  "averagePresent": "87.5",
  "dailyData": [
    {
      "date": "2024-01-15",
      "hadir": 6,
      "sakit": 1,
      "alpha": 0,
      "izin": 0
    }
  ],
  "statusComposition": [
    {
      "name": "Hadir",
      "value": 85
    },
    {
      "name": "Sakit",
      "value": 10
    },
    {
      "name": "Alpha",
      "value": 5
    }
  ],
  "studentData": [
    {
      "id": 1,
      "nisn": "0012345678",
      "name": "Andi Wijaya",
      "hadir": 14,
      "sakit": 1,
      "izin": 0,
      "alpha": 0,
      "percentage": "93.3"
    }
  ]
}
\`\`\`

## Status Values

Attendance status dapat berupa:
- `hadir` - Hadir
- `sakit` - Sakit
- `izin` - Izin
- `alpha` - Alpha/Tanpa Keterangan

## Error Responses

Semua error responses mengikuti format:

\`\`\`json
{
  "error": "Error message description",
  "status": 400
}
\`\`\`

Common status codes:
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error
