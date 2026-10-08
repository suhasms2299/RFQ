import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { chartData } from './mockRfqs';

export default function ProcurementChart() {
  return (
    <Box sx={{ height: 220, width: '100%' }}>
      <Stack direction="row" spacing={2} sx={{ mb: 1.5 }}>
        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}><Box component="span" sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%' }} /> RFQ volume</Typography>
        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}><Box component="span" sx={{ width: 8, height: 8, bgcolor: 'secondary.main', borderRadius: '50%' }} /> Awarded</Typography>
      </Stack>
      <ResponsiveContainer width="100%" height="88%">
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="rfqVolume" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#287258" stopOpacity={0.18} /><stop offset="100%" stopColor="#287258" stopOpacity={0.01} /></linearGradient>
            <linearGradient id="rfqAwarded" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c6794f" stopOpacity={0.15} /><stop offset="100%" stopColor="#c6794f" stopOpacity={0.01} /></linearGradient>
          </defs>
          <CartesianGrid stroke="#e9ede8" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#7a867e', fontSize: 11 }} dy={8} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#7a867e', fontSize: 10 }} />
          <Tooltip contentStyle={{ border: '1px solid #e2e8e1', borderRadius: 4, fontSize: 12 }} />
          <Area type="monotone" dataKey="volume" name="RFQ volume" stroke="#287258" strokeWidth={2} fill="url(#rfqVolume)" />
          <Area type="monotone" dataKey="awarded" name="Awarded" stroke="#c6794f" strokeWidth={2} fill="url(#rfqAwarded)" />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}