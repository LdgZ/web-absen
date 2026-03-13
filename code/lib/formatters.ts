export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (date: Date | string): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${parseFloat(value.toFixed(decimals))}%`;
};

export const getMonthName = (monthIndex: number): string => {
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  return months[monthIndex];
};

export const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case 'HADIR':
      return 'bg-green-100 text-green-800';
    case 'SAKIT':
      return 'bg-orange-100 text-orange-800';
    case 'IZIN':
      return 'bg-blue-100 text-blue-800';
    case 'ALPHA':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    HADIR: 'Hadir',
    SAKIT: 'Sakit',
    IZIN: 'Izin',
    ALPHA: 'Alpha',
  };
  return labels[status] || status;
};
