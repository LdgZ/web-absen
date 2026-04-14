export const SMSTemplates = {
  alpha: (studentName: string, date: string, schoolName: string = 'Sekolah') => `
Halo Bapak/Ibu wali murid,

Hari ini ${studentName} tidak masuk sekolah tanpa keterangan (Alpha) pada tanggal ${date}.
Jika ada informasi lebih lanjut, mohon hubungi pihak sekolah ya.

Terima kasih,
${schoolName}
  `.trim(),

  warning: (studentName: string, count: number, schoolName: string = 'Sekolah') => `
Halo Bapak/Ibu wali murid,

Kami ingin menginfokan bahwa ${studentName} sudah tidak hadir (Alpha) sebanyak ${count} kali bulan ini.
Mohon bantuannya untuk lebih memperhatikan kehadiran ananda di sekolah ya.

Terima kasih,
${schoolName}
  `.trim(),

  present: (studentName: string, schoolName: string = 'Sekolah') => `
Halo Bapak/Ibu wali murid,

Sekadar menginfokan, hari ini ${studentName} sudah hadir di sekolah dengan selamat. Selamat belajar untuk ananda!

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
