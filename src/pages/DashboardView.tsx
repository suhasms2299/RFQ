import React, { useMemo, useState } from 'react';
import { ArrowRight, Plus, Search as SearchIcon } from 'lucide-react';
import { Box, Button, Grid, MenuItem, Paper, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import { useRfqs } from '../hooks/useRfqs';
import { traderAccounts } from '../data/mockRfqs';
import ProcurementChart from '../components/charts/ProcurementChart';
import RfqStatusChart from '../components/charts/RfqStatusChart';
import RFQCard from '../components/rfq/RFQCard';
import RFQForm from '../components/forms/RFQForm';
import { Rfq, UserRole } from '../types/index';

const dashboardTabs = ['Active RFQs', 'Pending Quotes', 'Completed Trades', 'Drafts'];
const statusOptions = ['All statuses', 'Open', 'Pending Broker Approval', 'Quoted', 'Executed', 'Expired', 'Draft'];

function isInTab(rfq: Rfq, tab: string) {
  if (tab === 'Active RFQs') return ['Open', 'Pending Broker Approval', 'Quoted'].includes(rfq.status);
  if (tab === 'Pending Quotes') return rfq.quotes.some((quote) => quote.status === 'Submitted');
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
  const [deliveryBefore, setDeliveryBefore] = useState('');
  const [account, setAccount] = useState('All trader accounts');
  const [formOpen, setFormOpen] = useState(false);

  const scopedRfqs = useMemo(() => rfqs.filter((rfq) => {
    if (role === 'trader' && rfq.traderAccount !== 'North Harbor Trading') return false;
    if (role === 'broker' && account !== 'All trader accounts' && rfq.traderAccount !== account) return false;
    if (!isInTab(rfq, tab)) return false;
    if (status !== 'All statuses' && rfq.status !== status) return false;
    if (deliveryAfter && rfq.startDate < deliveryAfter) return false;
    if (deliveryBefore && rfq.startDate > deliveryBefore) return false;
    const needle = search.trim().toLowerCase();
    if (needle && ![rfq.id, rfq.commodity, rfq.traderAccount, rfq.status, rfq.description].some((field) => field.toLowerCase().includes(needle))) return false;
    return true;
  }), [account, deliveryAfter, deliveryBefore, rfqs, role, search, status, tab]);

  const summaryRfqs = rfqs.filter((rfq) => role === 'broker'
    ? account === 'All trader accounts' || rfq.traderAccount === account
    : rfq.traderAccount === 'North Harbor Trading');
  const openCount = summaryRfqs.filter((rfq) => ['Open', 'Pending Broker Approval', 'Quoted'].includes(rfq.status)).length;
  const pendingQuotes = summaryRfqs.reduce((total, rfq) => total + rfq.quotes.filter((quote) => quote.status === 'Submitted').length, 0);
  const completedCount = summaryRfqs.filter((rfq) => rfq.status === 'Executed').length;

  return (
    <Box className="page-content">
      <Stack className="page-title-row" direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'flex-end' }} justifyContent="space-between" spacing={2}>
        <Box><Typography variant="overline" color="text.secondary">COMMODITY PROCUREMENT / {role.toUpperCase()} DESK</Typography><Typography variant="h1" sx={{ fontSize: { xs: 28, sm: 34 }, fontWeight: 400 }}>Good morning, {role === 'broker' ? 'Jordan' : 'Alex'}</Typography><Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>{role === 'broker' ? 'Your clients’ market activity and requests.' : 'Your procurement activity, at a glance.'}</Typography></Box>
        <Button variant="contained" startIcon={<Plus size={17} />} onClick={() => setFormOpen(true)}>Create RFQ</Button>
      </Stack>

      <Grid container spacing={1.5} sx={{ mt: 2.2 }}>
        <Grid item xs={12} sm={4}><Paper variant="outlined" className="metric-tile"><Typography variant="caption" color="text.secondary">ACTIVE RFQs</Typography><Typography variant="h4">{String(openCount).padStart(2, '0')}</Typography><Typography variant="caption" color="success.main">Live across delivery windows</Typography></Paper></Grid>
        <Grid item xs={12} sm={4}><Paper variant="outlined" className="metric-tile"><Typography variant="caption" color="text.secondary">PENDING OFFERS</Typography><Typography variant="h4">{String(pendingQuotes).padStart(2, '0')}</Typography><Typography variant="caption" color="warning.dark">Requires review</Typography></Paper></Grid>
        <Grid item xs={12} sm={4}><Paper variant="outlined" className="metric-tile"><Typography variant="caption" color="text.secondary">COMPLETED THIS PERIOD</Typography><Typography variant="h4">{String(completedCount).padStart(2, '0')}</Typography><Typography variant="caption" color="text.secondary">Executed trades</Typography></Paper></Grid>
      </Grid>

      <Grid container spacing={1.5} sx={{ mt: 0.2 }}>
        <Grid item xs={12} lg={6}><Paper variant="outlined" className="chart-panel"><Stack direction="row" justifyContent="space-between" alignItems="flex-start"><Box><Typography variant="overline" color="text.secondary">DESK ACTIVITY</Typography><Typography variant="h6">RFQ volume & awards</Typography></Box><Typography variant="caption" color="text.secondary">Last 6 months</Typography></Stack><ProcurementChart /></Paper></Grid>
        <Grid item xs={12} lg={6}><Paper variant="outlined" className="chart-panel status-panel"><Stack direction="row" justifyContent="space-between" alignItems="flex-start"><Box><Typography variant="overline" color="text.secondary">PORTFOLIO MIX</Typography><Typography variant="h6">RFQs by status</Typography></Box><Typography variant="caption" color="text.secondary">Current account scope</Typography></Stack><RfqStatusChart rfqs={summaryRfqs} /></Paper></Grid>
        <Grid item xs={12}><Paper variant="outlined" className="market-panel"><Stack direction="row" justifyContent="space-between" alignItems="baseline"><Box><Typography variant="overline" color="text.secondary">MARKET SNAPSHOT</Typography><Typography variant="h6" sx={{ mb: 1.2 }}>Indicative prices</Typography></Box><Typography variant="caption" color="text.secondary">Indicative only · Confirm before trading</Typography></Stack>
          <Grid container spacing={1}>{[['CBOT Wheat', '$5.82 / bu', '+0.6%'], ['Brent Crude', '$78.34 / bbl', '−0.2%'], ['Gold Spot', '$2,664 / oz', '+0.9%'], ['Palm Oil', '$1,028 / MT', '+1.1%']].map(([label, price, change]) => <Grid item xs={12} sm={6} md={3} key={label}><Stack className="market-row" direction="row" justifyContent="space-between" alignItems="center"><Typography variant="body2">{label}</Typography><Stack direction="row" spacing={1} alignItems="center"><Typography variant="body2" fontWeight={700}>{price}</Typography><Typography variant="caption" color={change.startsWith('+') ? 'success.main' : 'error.main'}>{change}</Typography></Stack></Stack></Grid>)}</Grid>
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
          <TextField size="small" placeholder="Search commodity, trader or RFQ" value={search} onChange={(event) => setSearch(event.target.value)} InputProps={{ startAdornment: <SearchIcon size={17} style={{ marginRight: 8, color: '#71817c' }} /> }} sx={{ flex: 1 }} />
          <TextField select size="small" label="Status" value={status} onChange={(event) => setStatus(event.target.value)} sx={{ minWidth: 205 }}>{statusOptions.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}</TextField>
          <TextField size="small" label="Delivery from" type="date" value={deliveryAfter} onChange={(event) => setDeliveryAfter(event.target.value)} InputLabelProps={{ shrink: true }} sx={{ minWidth: 160 }} />
          <TextField size="small" label="Delivery to" type="date" value={deliveryBefore} onChange={(event) => setDeliveryBefore(event.target.value)} InputLabelProps={{ shrink: true }} sx={{ minWidth: 160 }} />
        </Stack>
        {scopedRfqs.length ? <Grid container spacing={1.5} sx={{ px: 2, pb: 2 }}>{scopedRfqs.map((rfq) => <Grid item xs={12} md={6} key={rfq.id}><RFQCard rfq={rfq} role={role} /></Grid>)}</Grid> : <Box className="empty-feed"><Typography variant="body2" color="text.secondary">No requests match these filters.</Typography><Button size="small" endIcon={<ArrowRight size={16} />} onClick={() => { setStatus('All statuses'); setSearch(''); setDeliveryAfter(''); setDeliveryBefore(''); setAccount('All trader accounts'); }}>Clear filters</Button></Box>}
      </Paper>
      <RFQForm open={formOpen} role={role} onClose={() => setFormOpen(false)} />
    </Box>
  );
}