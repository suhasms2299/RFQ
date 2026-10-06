import React from 'react';
import { Schedule } from '@mui/icons-material';
import { Grid, Paper, Typography } from '@mui/material';
import { Rfq } from '../../types';
import ValidityCountdown from './ValidityCountdown';

export default function RFQSummaryMetrics({ rfq }: { rfq: Rfq }) {
  const unit = rfq.unit === 'Liter' ? 'L' : 'MT';
  return (
    <Grid container spacing={1.5} sx={{ mt: 2 }}>
      <Grid item xs={12} sm={6} md={3}><Paper variant="outlined" className="detail-metric"><Typography variant="caption" color="text.secondary">REQUESTED VOLUME</Typography><Typography variant="h5">{rfq.quantity.toLocaleString()} <Typography component="span" variant="body2">{unit}</Typography></Typography></Paper></Grid>
      <Grid item xs={12} sm={6} md={3}><Paper variant="outlined" className="detail-metric"><Typography variant="caption" color="text.secondary">TARGET PRICE</Typography><Typography variant="h5">${rfq.price.toLocaleString()} <Typography component="span" variant="body2">/ {unit}</Typography></Typography></Paper></Grid>
      <Grid item xs={12} sm={6} md={3}><Paper variant="outlined" className="detail-metric"><Typography variant="caption" color="text.secondary">OFFERS RECEIVED</Typography><Typography variant="h5">{rfq.quotes.length}</Typography></Paper></Grid>
      <Grid item xs={12} sm={6} md={3}><Paper variant="outlined" className="detail-metric validity-metric"><Typography variant="caption" color="text.secondary">QUOTE CUTOFF</Typography><Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}><Schedule fontSize="small" color="warning" /><ValidityCountdown value={rfq.validUntil} /></Typography><Typography variant="caption" color="text.secondary">{new Date(rfq.validUntil).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</Typography></Paper></Grid>
    </Grid>
  );
}