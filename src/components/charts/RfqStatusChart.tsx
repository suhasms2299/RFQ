import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Rfq, RfqStatus } from '../../types';

const statusColors: Record<RfqStatus, string> = {
  Open: '#4b7c52',
  'Pending Broker Approval': '#bd862d',
  Quoted: '#4f78ad',
  Executed: '#315f9e',
  Expired: '#a16b7b',
  Draft: '#a2aab4',
};

const statuses: RfqStatus[] = ['Open', 'Pending Broker Approval', 'Quoted', 'Executed', 'Expired', 'Draft'];

export default function RfqStatusChart({ rfqs }: { rfqs: Rfq[] }) {
  const data = statuses.map((status) => ({
    status,
    count: rfqs.filter((rfq) => rfq.status === status).length,
    fill: statusColors[status],
  }));
  const total = data.reduce((sum, entry) => sum + entry.count, 0);

  return (
    <Box className="status-chart-layout">
      <Box className="status-chart-plot">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius="58%" outerRadius="82%" paddingAngle={3} stroke="none">
              {data.map((entry) => <Cell key={entry.status} fill={entry.fill} />)}
            </Pie>
            <Tooltip formatter={(value: number, name: string) => [`${value} RFQs`, name]} contentStyle={{ border: '1px solid #dfe3e8', borderRadius: 5, fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
        <Box className="status-chart-center"><strong>{total}</strong><span>Total RFQs</span></Box>
      </Box>
      <Stack className="status-chart-legend" spacing={1.2}>
        {data.map((entry) => <Box className="status-legend-row" key={entry.status}><span className="status-legend-dot" style={{ backgroundColor: entry.fill }} /><Typography variant="caption">{entry.status}</Typography><strong>{entry.count}</strong></Box>)}
      </Stack>
    </Box>
  );
}