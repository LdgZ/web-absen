import { useState, useCallback } from 'react';

interface AttendanceRecord {
  studentId: string;
  status: 'HADIR' | 'SAKIT' | 'IZIN' | 'ALPHA';
}

export const useAttendance = (classId: string) => {
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
  const [isSaving, setIsSaving] = useState(false);

  const updateStatus = useCallback(
    (studentId: string, status: 'HADIR' | 'SAKIT' | 'IZIN' | 'ALPHA') => {
      setAttendance((prev) => ({
        ...prev,
        [studentId]: { studentId, status },
      }));
    },
    []
  );

  const markAll = useCallback(
    (status: 'HADIR' | 'SAKIT' | 'IZIN' | 'ALPHA', studentIds: string[]) => {
      setAttendance((prev) => {
        const updated = { ...prev };
        studentIds.forEach((id) => {
          updated[id] = { studentId: id, status };
        });
        return updated;
      });
    },
    []
  );

  const saveAttendance = useCallback(
    async (records: AttendanceRecord[]) => {
      setIsSaving(true);
      try {
        const response = await fetch('/api/attendance/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            classId,
            date: new Date().toISOString().split('T')[0],
            records,
          }),
        });

        if (!response.ok) throw new Error('Failed to save');
        return await response.json();
      } finally {
        setIsSaving(false);
      }
    },
    [classId]
  );

  return {
    attendance: Object.values(attendance),
    updateStatus,
    markAll,
    saveAttendance,
    isSaving,
  };
};
