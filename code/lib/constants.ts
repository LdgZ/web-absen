export const CLASSES = [
  { id: 'class-1', name: '7A' },
  { id: 'class-2', name: '7B' },
  { id: 'class-3', name: '8A' },
  { id: 'class-4', name: '8B' },
];

export const ATTENDANCE_STATUS = ['HADIR', 'SAKIT', 'IZIN', 'ALPHA'] as const;

export const STATUS_COLORS = {
  HADIR: 'bg-green-50 border-green-200',
  SAKIT: 'bg-orange-50 border-orange-200',
  IZIN: 'bg-blue-50 border-blue-200',
  ALPHA: 'bg-red-50 border-red-200',
};
