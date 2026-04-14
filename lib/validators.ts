import { z } from 'zod';

export const StudentFormSchema = z.object({
  nis: z.string().min(1, 'NIS harus diisi').max(20, 'NIS maksimal 20 karakter'),
  name: z.string().min(3, 'Nama minimal 3 karakter').max(100, 'Nama maksimal 100 karakter'),
  classId: z.string().min(1, 'Kelas harus dipilih'),
  parentName: z.string().optional(),
  parentPhone: z.string().regex(/^62\d{9,12}$/, 'Nomor telepon tidak valid'),
});

export const ClassFormSchema = z.object({
  name: z.string().min(1, 'Nama kelas harus diisi'),
  teacherId: z.string().min(1, 'Guru harus dipilih'),
});

export const LoginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const AttendanceSchema = z.object({
  classId: z.string().min(1, 'Kelas harus dipilih'),
  date: z.string().min(1, 'Tanggal harus dipilih'),
  records: z.array(
    z.object({
      studentId: z.string(),
      status: z.enum(['HADIR', 'SAKIT', 'IZIN', 'ALPHA']),
    })
  ),
});

export type StudentFormType = z.infer<typeof StudentFormSchema>;
export type ClassFormType = z.infer<typeof ClassFormSchema>;
export type LoginType = z.infer<typeof LoginSchema>;
export type AttendanceType = z.infer<typeof AttendanceSchema>;
