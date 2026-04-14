'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { MessageSquare, Send, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

interface SMSLog {
  id: string;
  phone: string;
  message: string;
  status: 'sent' | 'failed';
  sent_at: string;
}

export function SMSNotificationPanel() {
  const [logs, setLogs] = useState<SMSLog[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
    fetchSettings();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/sms/logs?limit=10');
      const data = await response.json();
      setLogs(data.logs);
    } catch (error) {
      console.error('Error fetching SMS logs:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/sms/settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching SMS settings:', error);
    }
  };

  const handleToggleSMS = async (enabled: boolean) => {
    try {
      const response = await fetch('/api/sms/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, enabled }),
      });

      if (!response.ok) throw new Error('Failed to update');
      const data = await response.json();
      setSettings(data.settings);
      toast.success('Pengaturan SMS diperbarui');
    } catch (error) {
      toast.error('Gagal memperbarui pengaturan');
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings */}
      <Card className="p-6 border-0 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Pengaturan SMS
          </h3>
        </div>

        {settings && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">SMS Notifications</p>
                <p className="text-sm text-gray-600">Aktifkan notifikasi SMS otomatis</p>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) => handleToggleSMS(checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Kirim saat Alpha</p>
                <p className="text-sm text-gray-600">Notifikasi otomatis ketika siswa alpha</p>
              </div>
              <Switch checked={settings.sendOnAlpha} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Kirim Warning</p>
                <p className="text-sm text-gray-600">Notifikasi ketika alpha mencapai batas</p>
              </div>
              <Switch checked={settings.sendOnWarning} />
            </div>
          </div>
        )}
      </Card>

      {/* Recent Logs */}
      <Card className="p-6 border-0 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5" />
          Log SMS Terakhir
        </h3>

        {logs.length > 0 ? (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`p-4 rounded-lg border ${log.status === 'sent'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{log.phone}</p>
                    <p className="text-sm text-gray-600 mt-1">{log.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {log.sent_at ? new Date(log.sent_at).toLocaleString('id-ID') : '-'}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${log.status === 'sent'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {log.status === 'sent' ? 'Terkirim' : 'Gagal'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 py-8">Belum ada SMS yang terkirim</p>
        )}
      </Card>
    </div>
  );
}
