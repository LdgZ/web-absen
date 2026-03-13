export const SMSTemplates = {
  alpha: (studentName: string, date: string, schoolName: string = 'Sekolah') => `
Yth. Orang Tua/Wali,

Anak Anda ${(studentName || '').toUpperCase()} tidak hadir di sekolah pada tanggal ${date}.
Mohon konfirmasi alasan ketidakhadiran.

Terima kasih,
${schoolName}
  `.trim(),

  warning: (studentName: string, count: number, schoolName: string = 'Sekolah') => `
Yth. Orang Tua/Wali,

Kami ingin memberitahukan bahwa ${(studentName || '').toUpperCase()} sudah alpha ${count}x bulan ini.
Mohon perhatian khusus untuk meningkatkan kehadiran.

Terima kasih,
${schoolName}
  `.trim(),

  present: (studentName: string, schoolName: string = 'Sekolah') => `
Yth. Orang Tua/Wali,

Anak Anda ${(studentName || '').toUpperCase()} telah hadir hari ini di sekolah.

Terima kasih,
${schoolName}
  `.trim(),
};

export const sendAlphaSMS = async (parentPhone: string, studentName: string, date: string) => {
  const message = SMSTemplates.alpha(studentName, date);
  
  try {
    const response = await fetch('/api/sms/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: parentPhone,
        message: message,
        type: 'alpha',
      }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false };
  }
};
