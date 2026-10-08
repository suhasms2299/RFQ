import React from 'react';
import { ArrowOutward, Business, Schedule } from '@mui/icons-material';
import { Box, Card, CardActionArea, Chip, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Rfq, UserRole } from './types';

const statusColor: Record<Rfq['status'], 'success' | 'warning' | 'info' | 'primary' | 'default' | 'error'> = {
  Open: 'success',
  'Pending Broker Approval': 'warning',
  Quoted: 'info',
  Executed: 'primary',
  Expired: 'default',
  Draft: 'default',
};

function formatDate(value: string) {
  return new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function ValidityCountdown({ value }: { value: string }) {
  const remaining = new Date(value).getTime() - Date.now();
  if (remaining <= 0) return <span>Expired</span>;
  const hours = Math.floor(remaining / 3600000);
  if (hours >= 24) return <span>{Math.floor(hours / 24)}d {hours % 24}h left</span>;
  return <span>{hours}h {Math.floor((remaining % 3600000) / 60000)}m left</span>;
}

type RFQCardProps = { rfq: Rfq; role: UserRole };

export default function RFQCard({ rfq, role }: RFQCardProps) {
  const submittedQuotes = rfq.quotes.filter((quote) => quote.status === 'Submitted').length;
  return (
    <Card variant="outlined" sx={{ borderColor: 'divider', borderRadius: 1, height: '100%', transition: 'border-color .15s, transform .15s', '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)' } }}>
      <CardActionArea component={Link} to={`/${role}/rfq/${rfq.id}`} sx={{ height: '100%', p: 2, display: 'block', textAlign: 'left' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Box><Typography variant="overline" color="text.secondary">{rfq.id}</Typography><Typography variant="h6" sx={{ fontSize: 18 }}>{rfq.commodity}</Typography></Box>
          <Chip size="small" label={rfq.status} color={statusColor[rfq.status]} variant="outlined" />
        </Stack>
        <Stack direction="row" spacing={2.5} sx={{ mt: 2, flexWrap: 'wrap', rowGap: 1 }}>
          <Box><Typography variant="caption" color="text.secondary">VOLUME</Typography><Typography variant="body2" fontWeight={700}>{rfq.quantity.toLocaleString()} {rfq.unit === 'Liter' ? 'L' : 'MT'}</Typography></Box>
          <Box><Typography variant="caption" color="text.secondary">TARGET</Typography><Typography variant="body2" fontWeight={700}>${rfq.price.toLocaleString()} / {rfq.unit === 'Liter' ? 'L' : 'MT'}</Typography></Box>
          <Box><Typography variant="caption" color="text.secondary">OFFERS</Typography><Typography variant="body2" fontWeight={700}>{rfq.quotes.length}</Typography></Box>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 2, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={1.4} alignItems="center" flexWrap="wrap">
            {role === 'broker' && <Typography variant="caption" color="text.secondary" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4 }}><Business sx={{ fontSize: 14 }} />{rfq.traderAccount}</Typography>}
            <Typography variant="caption" color="text.secondary">{formatDate(rfq.startDate)} – {formatDate(rfq.endDate)}</Typography>
            {submittedQuotes > 0 && <Typography variant="caption" color="primary.main">{submittedQuotes} new {submittedQuotes === 1 ? 'offer' : 'offers'}</Typography>}
          </Stack>
          <Typography variant="caption" color="warning.dark" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4, whiteSpace: 'nowrap' }}><Schedule sx={{ fontSize: 14 }} /><ValidityCountdown value={rfq.validUntil} /></Typography>
          <ArrowOutward sx={{ fontSize: 15, color: 'text.secondary' }} />
        </Stack>
      </CardActionArea>
    </Card>
  );
}