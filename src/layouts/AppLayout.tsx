import React, { useState } from 'react';
import { Building2, ChartNoAxesCombined, ChevronRight, ClipboardList, LayoutDashboard, MessageSquareText } from 'lucide-react';
import { AppBar, Box, Button, Divider, Drawer, IconButton, Stack, ToggleButton, ToggleButtonGroup, Toolbar, Tooltip, Typography } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ProfileDialog from '../components/ProfileDialog';
import { UserRole } from '../types';

const drawerWidth = 244;

export default function AppLayout({ role }: { role: UserRole }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const isBroker = role === 'broker';
  const dashboardPath = `/${role}`;
  const navItems = [
    { label: 'Overview', icon: <LayoutDashboard size={17} strokeWidth={1.8} />, path: dashboardPath },
    { label: 'RFQ board', icon: <MessageSquareText size={17} strokeWidth={1.8} />, path: dashboardPath },
    { label: 'Accounts', icon: <Building2 size={17} strokeWidth={1.8} />, path: dashboardPath },
    { label: 'Market signals', icon: <ChartNoAxesCombined size={17} strokeWidth={1.8} />, path: dashboardPath },
    { label: 'Reports', icon: <ClipboardList size={17} strokeWidth={1.8} />, path: dashboardPath },
  ];

  return (
    <Box className="app-shell">
      <Drawer variant="permanent" className="app-drawer" sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}>
        <Box className="brand-lockup"><Box className="brand-mark">F</Box><Box><Typography className="brand-name">fieldnote<span>.</span></Typography><Typography className="brand-caption">COMMODITY DESK</Typography></Box></Box>
        <Typography className="workspace-label">WORKSPACE</Typography>
        <Button className="workspace-button" fullWidth endIcon={<ChevronRight size={16} />}><span className="workspace-initials">{isBroker ? 'CB' : 'NH'}</span><span className="workspace-name">{isBroker ? 'Clearwater Brokerage' : 'North Harbor Trading'}<small>{isBroker ? 'Broker desk' : 'Procurement team'}</small></span></Button>
        <Typography className="workspace-label trade-label">TRADE</Typography>
        <Stack className="side-nav">
          {navItems.map((item, index) => <Button key={item.label} className={`side-nav-item ${index === 0 && !location.pathname.includes('/rfq/') ? 'selected' : ''}`} startIcon={item.icon} onClick={() => navigate(item.path)}>{item.label}{item.label === 'RFQ board' && <span className="side-nav-count">{isBroker ? '06' : '03'}</span>}</Button>)}
        </Stack>
        <Box className="drawer-spacer" />
        <Box className="market-open-note"><span className="live-indicator" /> NY market open <span>09:42 ET</span></Box>
        <Divider sx={{ borderColor: '#40564c' }} />
        <Button className="user-profile" onClick={() => setProfileOpen(true)} aria-label="View my profile"><span className="user-avatar">{isBroker ? 'JL' : 'AM'}</span><span>{isBroker ? 'Jordan Lee' : 'Alex Morgan'}<small>{isBroker ? 'Broker' : 'Procurement lead'}</small></span><span className="profile-menu">View profile</span></Button>
      </Drawer>

      <Box className="main-frame">
        <AppBar position="sticky" elevation={0} className="top-app-bar"><Toolbar className="top-toolbar">
          <Stack direction="row" alignItems="center" spacing={1} className="breadcrumbs"><Typography variant="body2">Trade desk</Typography><span>/</span><Typography variant="body2" color="text.primary">{isBroker ? 'Broker workspace' : 'Trader workspace'}</Typography></Stack>
          <Stack direction="row" alignItems="center" spacing={1.5}><span className="top-market-status"><i /> NY market open</span><ToggleButtonGroup exclusive size="small" value={role} onChange={(_, value: UserRole | null) => { if (value) navigate(`/${value}`); }} aria-label="Switch trading role">
            <ToggleButton value="trader">Trader view</ToggleButton><ToggleButton value="broker">Broker view</ToggleButton>
          </ToggleButtonGroup><Tooltip title="View my profile"><IconButton className="top-profile-button" onClick={() => setProfileOpen(true)} aria-label="View my profile"><span className="top-user-avatar">{isBroker ? 'JL' : 'AM'}</span></IconButton></Tooltip></Stack>
        </Toolbar></AppBar>
        <Box component="main" className="main-content"><Outlet /></Box>
      </Box>
      <ProfileDialog open={profileOpen} role={role} onClose={() => setProfileOpen(false)} />
    </Box>
  );
}