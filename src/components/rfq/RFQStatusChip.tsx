import React from 'react';
import { Chip } from '@mui/material';
import { RfqStatus } from '../../types/index';

const statusColor: Record<RfqStatus, 'success' | 'warning' | 'info' | 'primary' | 'default' | 'error'> = {
  Open: 'success',
  'Pending Broker Approval': 'warning',
  Quoted: 'info',
  Executed: 'primary',
  Expired: 'default',
  Draft: 'default',
};

export default function RFQStatusChip({ status }: { status: RfqStatus }) {
  return <Chip size="small" label={status} color={statusColor[status]} variant="outlined" />;
}