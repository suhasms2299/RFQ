import React, { useState } from 'react';
import { ArrowBack } from '@mui/icons-material';
import { Alert, Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import QuoteResponseForm, { QuoteResponseDraft } from '../components/forms/QuoteResponseForm';
import QuotesTable from '../components/rfq/QuotesTable';
import RFQStatusChip from '../components/rfq/RFQStatusChip';
import RFQSummaryMetrics from '../components/rfq/RFQSummaryMetrics';
import { useRfqs } from '../hooks/useRfqs';
import { Quote, UserRole } from '../types/index';

function dateLabel(value: string) {
  return new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function RFQDetailPage({ role }: { role: UserRole }) {
  const { rfqId } = useParams<{ rfqId: string }>();
  const { rfqs, updateQuote, submitDraft } = useRfqs();
  const [respondQuote, setRespondQuote] = useState<Quote | null>(null);
  const rfq = rfqs.find((request) => request.id === rfqId);

  if (!rfq) return <Box className="page-content"><Alert severity="warning">This RFQ is unavailable.</Alert><Button component={Link} to={`/${role}`} startIcon={<ArrowBack />} sx={{ mt: 2 }}>Back to RFQ board</Button></Box>;

  const unit = rfq.unit === 'Liter' ? 'L' : 'MT';
  const pendingCount = rfq.quotes.filter((quote) => quote.status === 'Submitted').length;
  const sendResponse = (draft: QuoteResponseDraft) => {
    if (!respondQuote) return;
    updateQuote(rfq.id, respondQuote.id, 'respond', {
      price: Number(draft.price),
      negotiable: draft.negotiable,
      description: draft.description,
      respondedAt: new Date().toISOString(),
    });
    setRespondQuote(null);
  };

  return (
    <Box className="page-content detail-page">
      <Button component={Link} to={`/${role}`} startIcon={<ArrowBack />} color="inherit" size="small" sx={{ mb: 2 }}>Back to RFQ board</Button>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
        <Box><Typography variant="overline" color="text.secondary">{rfq.id} · {role === 'broker' ? rfq.traderAccount : 'YOUR ACCOUNT'}</Typography><Stack direction="row" spacing={1} alignItems="center"><Typography variant="h1" sx={{ fontSize: 32, fontWeight: 400 }}>{rfq.commodity}</Typography><RFQStatusChip status={rfq.status} /></Stack></Box>
        {role === 'broker' && rfq.status === 'Draft' && <Button variant="contained" onClick={() => submitDraft(rfq.id)}>Submit RFQ</Button>}
      </Stack>
      <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>{dateLabel(rfq.startDate)} – {dateLabel(rfq.endDate)} · Created {dateLabel(rfq.createdAt)}</Typography>

      <RFQSummaryMetrics rfq={rfq} />

      <Grid container spacing={1.5} sx={{ mt: 0.2 }}>
        <Grid item xs={12} lg={8}><Paper variant="outlined" className="quote-panel"><Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ p: 2 }}><Box><Typography variant="overline" color="text.secondary">COUNTERPARTY RESPONSE</Typography><Typography variant="h6">Submitted offers</Typography></Box><Typography variant="caption" color="text.secondary">{pendingCount} awaiting response</Typography></Stack>
          {rfq.quotes.length === 0 ? <Box className="empty-quotes"><Typography variant="body2" color="text.secondary">No offers have arrived yet.</Typography><Typography variant="caption" color="text.secondary">Invited: {rfq.counterparties.join(', ') || 'No counterparties selected'}</Typography></Box> : <QuotesTable quotes={rfq.quotes} targetPrice={rfq.price} unit={unit} rfqStatus={rfq.status} onAccept={(quote) => updateQuote(rfq.id, quote.id, 'accept')} onRespond={setRespondQuote} onDecline={(quote) => updateQuote(rfq.id, quote.id, 'decline')} />}
        </Paper></Grid>
        <Grid item xs={12} lg={4}><Paper variant="outlined" className="terms-panel"><Typography variant="overline" color="text.secondary">COMMERCIAL TERMS</Typography><Typography variant="h6" sx={{ mb: 1.5 }}>Delivery & specifications</Typography><Stack spacing={1.5}><Box><Typography variant="caption" color="text.secondary">DELIVERY WINDOW</Typography><Typography variant="body2">{dateLabel(rfq.startDate)} – {dateLabel(rfq.endDate)}</Typography></Box><Box><Typography variant="caption" color="text.secondary">DESCRIPTION</Typography><Typography variant="body2" sx={{ lineHeight: 1.65 }}>{rfq.description || 'No additional terms supplied.'}</Typography></Box><Box><Typography variant="caption" color="text.secondary">INVITED COUNTERPARTIES</Typography><Typography variant="body2">{rfq.counterparties.join(', ') || 'No counterparties selected'}</Typography></Box></Stack></Paper></Grid>
      </Grid>
      {rfq.status === 'Executed' && <Alert severity="success" sx={{ mt: 2 }}>This RFQ has been executed. The accepted offer is marked above.</Alert>}

      <QuoteResponseForm open={Boolean(respondQuote)} counterparty={respondQuote?.counterparty ?? ''} initialPrice={respondQuote?.price ?? rfq.price} unit={unit} onClose={() => setRespondQuote(null)} onSubmit={sendResponse} />
    </Box>
  );
}