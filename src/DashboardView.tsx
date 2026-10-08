import React, { useMemo, useState } from 'react';
import { Add, ArrowForward, Search } from '@mui/icons-material';
import { Box, Button, Grid, MenuItem, Paper, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import { useRfqs } from './RfqContext';
import { traderAccounts } from './mockRfqs';
import ProcurementChart from './ProcurementChart';
import RFQCard from './RFQCard';
import RFQForm from './RFQForm';
import { Rfq, UserRole } from './types';

const dashboardTabs = ['Active RFQs', 'Pending Quotes', 'Completed Trades', 'Drafts'];
const statusOptions = ['All statuses', 'Open', 'Pending Broker Approval', 'Quoted', 'Executed', 'Expired', 'Draft'];

function isInTab(rfq: Rfq, tab: string) {
  if (tab === 'Active RFQs') return ['Open', 'Pending Broker Approval', 'Quoted'].includes(rfq.status);
  if (tab === 'Pending Quotes') return rfq.quotes.some((quote) => quote.status === 'Submitted' || quote.status === 'Countered');
  if (tab === 'Completed Trades') return rfq.status === 'Executed' || rfq.status === 'Expired';
  return rfq.status === 'Draft';
}

type DashboardViewProps = { role: UserRole };

export default function DashboardView({ role }: DashboardViewProps) {
  const { rfqs } = useRfqs();
  const [tab, setTab] = useState(dashboardTabs[0]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [deliveryAfter, setDeliveryAfter] = useState('');
  const [account, setAccount] = useState('All trader accounts');
  const [formOpen, setFormOpen] = useState(false);

  const scopedRfqs = useMemo(() => rfqs.filter((rfq) => {
    if (role === 'trader' && rfq.traderAccount !== 'North Harbor Trading') return false;
    if (role === 'broker' && account !== 'All trader accounts' && rfq.traderAccount !== account) return false;
    if (!isInTab(rfq, tab)) return false;
    if (status !== 'All statuses' && rfq.status !== status) return false;
    if (deliveryAfter && rfq.startDate < deliveryAfter) return false;
    const needle = search.trim().toLowerCase();
    if (needle && ![rfq.id, rfq.commodity, rfq.traderAccount, rfq.status, rfq.description].some((field) => field.toLowerCase().includes(needle))) return false;
    return true;
  }), [account, deliveryAfter, rfqs, role, search, status, tab]);

  const openCount = rfqs.filter((rfq) => ['Open', 'Pending Broker Approval', 'Quoted'].includes(rfq.status) && (role === 'broker' || rfq.traderAccount === 'North Harbor Trading')).length;
  const pendingQuotes = rfqs.reduce((total, rfq) => total + rfq.quotes.filter((quote) => quote.status === 'Submitted').length, 0);
  const completedCount = rfqs.filter((rfq) => rfq.status === 'Executed' && (role === 'broker' || rfq.traderAccount === 'North Harbor Trading')).length;

  return (
    <Box className="page-content">
      <Stack className="page-title-row" direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'flex-end' }} justifyContent="space-between" spacing={2}>
        <Box><Typography variant="overline" color="text.secondary">COMMODITY PROCUREMENT / {role.toUpperCase()} DESK</Typography><Typography variant="h1" sx={{ fontSize: { xs: 28, sm: 34 }, fontFamily: 'Georgia, serif', fontWeight: 400 }}>Good morning, {role === 'broker' ? 'Jordan' : 'Alex'}</Typography><Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>{role === 'broker' ? 'Your clients’ market activity and requests.' : 'Your procurement activity, at a glance.'}</Typography></Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setFormOpen(true)}>Create RFQ</Button>
      </Stack>

      <Grid container spacing={1.5} sx={{ mt: 2.2 }}>
        <Grid item xs={12} sm={4}><Paper variant="outlined" className="metric-tile"><Typography variant="caption" color="text.secondary">ACTIVE RFQs</Typography><Typography variant="h4">{String(openCount).padStart(2, '0')}</Typography><Typography variant="caption" color="success.main">Live across delivery windows</Typography></Paper></Grid>
        <Grid item xs={12} sm={4}><Paper variant="outlined" className="metric-tile"><Typography variant="caption" color="text.secondary">PENDING OFFERS</Typography><Typography variant="h4">{String(pendingQuotes).padStart(2, '0')}</Typography><Typography variant="caption" color="warning.dark">Requires review</Typography></Paper></Grid>
        <Grid item xs={12} sm={4}><Paper variant="outlined" className="metric-tile"><Typography variant="caption" color="text.secondary">COMPLETED THIS PERIOD</Typography><Typography variant="h4">{String(completedCount).padStart(2, '0')}</Typography><Typography variant="caption" color="text.secondary">Executed trades</Typography></Paper></Grid>
      </Grid>

      <Grid container spacing={1.5} sx={{ mt: 0.2 }}>
        <Grid item xs={12} lg={8}><Paper variant="outlined" className="chart-panel"><Stack direction="row" justifyContent="space-between" alignItems="flex-start"><Box><Typography variant="overline" color="text.secondary">DESK ACTIVITY</Typography><Typography variant="h6">RFQ volume & awards</Typography></Box><Typography variant="caption" color="text.secondary">Last 6 months</Typography></Stack><ProcurementChart /></Paper></Grid>
        <Grid item xs={12} lg={4}><Paper variant="outlined" className="market-panel"><Typography variant="overline" color="text.secondary">MARKET SNAPSHOT</Typography><Typography variant="h6" sx={{ mb: 1.2 }}>Indicative prices</Typography>
          {[['CBOT Wheat', '$5.82 / bu', '+0.6%'], ['Brent Crude', '$78.34 / bbl', '−0.2%'], ['Gold Spot', '$2,664 / oz', '+0.9%'], ['Palm Oil', '$1,028 / MT', '+1.1%']].map(([label, price, change]) => <Stack key={label} className="market-row" direction="row" justifyContent="space-between" alignItems="center"><Typography variant="body2">{label}</Typography><Stack direction="row" spacing={1} alignItems="center"><Typography variant="body2" fontWeight={700}>{price}</Typography><Typography variant="caption" color={change.startsWith('+') ? 'success.main' : 'error.main'}>{change}</Typography></Stack></Stack>)}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.2 }}>Indicative only. Confirm before trading.</Typography>
        </Paper></Grid>
      </Grid>

      <Paper variant="outlined" className="rfq-feed-panel">
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" spacing={1} sx={{ px: 2, pt: 1.5 }}>
          <Box><Typography variant="overline" color="text.secondary">PROCUREMENT PIPELINE</Typography><Typography variant="h6">RFQ board</Typography></Box>
          {role === 'broker' && <TextField select size="small" label="Trader account" value={account} onChange={(event) => setAccount(event.target.value)} sx={{ minWidth: { sm: 225 } }}><MenuItem value="All trader accounts">All trader accounts</MenuItem>{traderAccounts.map((name) => <MenuItem key={name} value={name}>{name}</MenuItem>)}</TextField>}
        </Stack>
        <Tabs value={tab} onChange={(_, value: string) => setTab(value)} variant="scrollable" scrollButtons="auto" sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}>
          {dashboardTabs.map((label) => <Tab key={label} value={label} label={label} />)}
        </Tabs>
        <Stack className="feed-filters" direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ p: 2 }}>
          <TextField size="small" placeholder="Search commodity, trader or RFQ" value={search} onChange={(event) => setSearch(event.target.value)} InputProps={{ startAdornment: <Search fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> }} sx={{ flex: 1 }} />
          <TextField select size="small" label="Status" value={status} onChange={(event) => setStatus(event.target.value)} sx={{ minWidth: 205 }}>{statusOptions.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}</TextField>
          <TextField size="small" label="Delivery from" type="date" value={deliveryAfter} onChange={(event) => setDeliveryAfter(event.target.value)} InputLabelProps={{ shrink: true }} sx={{ minWidth: 180 }} />
        </Stack>
        {scopedRfqs.length ? <Grid container spacing={1.5} sx={{ px: 2, pb: 2 }}>{scopedRfqs.map((rfq) => <Grid item xs={12} md={6} key={rfq.id}><RFQCard rfq={rfq} role={role} /></Grid>)}</Grid> : <Box className="empty-feed"><Typography variant="body2" color="text.secondary">No requests match these filters.</Typography><Button size="small" endIcon={<ArrowForward />} onClick={() => { setStatus('All statuses'); setSearch(''); setDeliveryAfter(''); setAccount('All trader accounts'); }}>Clear filters</Button></Box>}
      </Paper>
      <RFQForm open={formOpen} role={role} onClose={() => setFormOpen(false)} />
    </Box>
  );
}