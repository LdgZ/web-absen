import { query } from './db';

type SendResult = {
  success: boolean;
  provider?: string;
  response?: any;
  error?: string;
};

// Provider-agnostic SMS sender with Fonnte fallback.
export async function sendSMS(phone: string, message: string): Promise<SendResult> {
  const apiKey = process.env.FONNTE_API_KEY;

  // Normalize phone: convert 0 to 62 for international format
  let to = phone?.toString() || '';
  if (to.startsWith('0')) {
    to = '62' + to.substring(1);
  }
  
  if (!to) return { success: false, error: 'No phone number' };

  if (apiKey) {
    try {
      // ensure sms_logs table exists (best-effort)
      try {
        await query(`
          CREATE TABLE IF NOT EXISTS sms_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            phone VARCHAR(50),
            message TEXT,
            status VARCHAR(20),
            provider VARCHAR(50),
            response JSON,
            sent_at DATETIME
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
      } catch (e) {
        // ignore if create fails
      }

      console.log('Sending SMS via Fonnte:', { to, apiKeyLength: apiKey?.length });

      // Fonnte API - correct endpoint and format
      const res = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: apiKey, // Fonnte uses plain token, not Bearer
        },
        body: JSON.stringify({ 
          target: to, 
          message: message 
        }),
      });

      console.log('Fonnte API response status:', res.status);

      let data: any = {};
      const contentType = res.headers.get('content-type');
      
      try {
        if (contentType?.includes('application/json')) {
          data = await res.json();
          console.log('Fonnte API response data:', data);
        } else {
          // Response is not JSON, get text for debugging
          const text = await res.text();
          console.error('Fonnte API response is not JSON. Status:', res.status, 'Body:', text.substring(0, 300));
          data = { error: 'Invalid response format from API', status: res.status };
        }
      } catch (parseErr) {
        console.error('Error parsing Fonnte response:', parseErr);
        data = { error: String(parseErr) };
      }

      const isSuccess = res.ok || (data.status === 'ok');

      // Attempt to log into DB (best effort)
      try {
        await query(
          'INSERT INTO sms_logs (phone, message, status, provider, response, sent_at) VALUES (?, ?, ?, ?, ?, NOW())',
          [to, message, isSuccess ? 'sent' : 'failed', 'fonnte', JSON.stringify(data)]
        );
      } catch (e) {
        // ignore logging errors
        console.warn('sms log insert failed', e);
      }

      return { success: isSuccess, provider: 'fonnte', response: data };
    } catch (error: any) {
      console.error('SMS send error:', error);
      return { success: false, error: error?.message || String(error) };
    }
  }

  // No provider configured — fall back to failing response but still log attempt.
  try {
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS sms_logs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          phone VARCHAR(50),
          message TEXT,
          status VARCHAR(20),
          provider VARCHAR(50),
          response JSON,
          sent_at DATETIME
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
    } catch (e) {}
    await query(
      'INSERT INTO sms_logs (phone, message, status, provider, response, sent_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [to, message, 'failed', 'none', JSON.stringify({ reason: 'no-provider' })]
    );
  } catch (e) {
    // ignore
  }

  return { success: false, error: 'No SMS provider configured (set FONNTE_API_KEY)' };
}
