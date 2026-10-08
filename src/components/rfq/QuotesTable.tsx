import React from 'react';
import { CheckCircleOutline, TrendingDown } from '@mui/icons-material';
import { Box, Button, Chip, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Quote, QuoteResponse, RfqStatus } from '../../types/index';
import ValidityCountdown from './ValidityCountdown';

type QuotesTableProps = {
  quotes: Quote[];
  targetPrice: number;
  unit: string;
  rfqStatus: RfqStatus;
  onAccept: (quote: Quote) => void;
  onRespond: (quote: Quote) => void;
  onDecline: (quote: Quote) => void;
};

export default function QuotesTable({ quotes, targetPrice, unit, rfqStatus, onAccept, onRespond, onDecline }: QuotesTableProps) {
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size="small" className="quotes-table">
        <TableHead><TableRow><TableCell>COUNTERPARTY</TableCell><TableCell>SUPPLIER OFFER</TableCell><TableCell>YOUR RESPONSE</TableCell><TableCell>EXPIRES IN</TableCell><TableCell>STATUS</TableCell><TableCell align="right">ACTIONS</TableCell></TableRow></TableHead>
        <TableBody>
          {quotes.map((quote) => <TableRow key={quote.id} hover>
            <TableCell><Typography variant="body2" fontWeight={700}>{quote.counterparty}</Typography><Typography variant="caption" color="text.secondary">{quote.notes}</Typography></TableCell>
            <TableCell><Stack direction="row" spacing={0.5} alignItems="center"><Typography fontWeight={700}>${quote.price.toLocaleString()}</Typography><Typography variant="caption" color="text.secondary">/ {unit}</Typography>{quote.price <= targetPrice && <TrendingDown fontSize="inherit" color="success" />}</Stack></TableCell>
            <TableCell>{quote.response ? <Box className="quote-response-summary"><Typography variant="body2" fontWeight={700}>${quote.response.price.toLocaleString()} / {unit}</Typography><Typography variant="caption">{quote.response.negotiable ? 'Negotiable' : 'Firm'} · {quote.response.description}</Typography></Box> : <Typography variant="caption" color="text.secondary">No response yet</Typography>}</TableCell>
            <TableCell><Typography variant="caption" color={new Date(quote.expiresAt).getTime() <= Date.now() ? 'error.main' : 'warning.dark'}><ValidityCountdown value={quote.expiresAt} /></Typography></TableCell>
            <TableCell><Chip size="small" label={quote.status} color={quote.status === 'Accepted' ? 'success' : quote.status === 'Declined' ? 'default' : quote.status === 'Responded' ? 'secondary' : 'info'} variant="outlined" /></TableCell>
            <TableCell align="right"><Stack direction="row" justifyContent="flex-end" spacing={0.5}>
              {quote.status === 'Submitted' && rfqStatus !== 'Executed' && new Date(quote.expiresAt).getTime() > Date.now() && <><Button size="small" color="success" startIcon={<CheckCircleOutline />} onClick={() => onAccept(quote)}>Accept</Button><Button size="small" color="secondary" onClick={() => onRespond(quote)}>Respond</Button><Button size="small" color="error" onClick={() => onDecline(quote)}>Decline</Button></>}
            </Stack></TableCell>
          </TableRow>)}
        </TableBody>
      </Table>
    </Box>
  );
}