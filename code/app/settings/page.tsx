'use client';

import { SMSNotificationPanel } from '@/components/sms-notification-panel';
import { Card } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan</h1>
          <p className="text-gray-600 mt-2">Kelola konfigurasi sistem presensi</p>
        </div>

        {/* SMS Settings */}
        <SMSNotificationPanel />
      </div>
    </div>
  );
}
