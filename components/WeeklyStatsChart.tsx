"use client";

import React from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

interface Props {
  data: Array<{ day: string; hadir: number; sakit: number; alpha: number }>;
}

export default function WeeklyStatsChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="hadir" fill="#059669" name="Hadir" />
        <Bar dataKey="sakit" fill="#D97706" name="Sakit" />
        <Bar dataKey="alpha" fill="#DC2626" name="Alpha" />
      </BarChart>
    </ResponsiveContainer>
  );
}
