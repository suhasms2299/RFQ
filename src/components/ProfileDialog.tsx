import React from 'react';
import { AccountCircle, BadgeOutlined, BusinessOutlined, MailOutline, ShieldOutlined } from '@mui/icons-material';
import { Avatar, Box, Chip, Dialog, DialogContent, DialogTitle, Divider, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { UserRole } from '../types/index';

type ProfileDialogProps = {
  open: boolean;
  role: UserRole;
  onClose: () => void;
};

export default function ProfileDialog({ open, role, onClose }: ProfileDialogProps) {
  const broker = role === 'broker';
  const name = broker ? 'Jordan Lee' : 'Alex Morgan';
  const initials = broker ? 'JL' : 'AM';
  const workspace = broker ? 'Clearwater Brokerage' : 'North Harbor Trading';
  const email = broker ? 'jordan.lee@clearwater.example' : 'alex.morgan@northharbor.example';
  const title = broker ? 'Broker' : 'Procurement lead';

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" aria-labelledby="profile-dialog-title">
      <DialogTitle id="profile-dialog-title" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h5" sx={{ fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif", fontWeight: 600 }}>My profile</Typography>
        <IconButton aria-label="Close profile" onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ py: 1.5 }}>
          <Avatar sx={{ width: 54, height: 54, bgcolor: 'primary.main', fontSize: 15 }}>{initials}</Avatar>
          <Box><Typography variant="h6">{name}</Typography><Typography variant="body2" color="text.secondary">{title}</Typography></Box>
          <Chip size="small" color={broker ? 'secondary' : 'primary'} variant="outlined" label={broker ? 'Broker view' : 'Trader view'} sx={{ ml: 'auto' }} />
        </Stack>
        <Divider sx={{ my: 1.5 }} />
        <Stack spacing={1.8} sx={{ py: 0.5 }}>
          <Stack direction="row" spacing={1.2} alignItems="center"><MailOutline fontSize="small" color="action" /><Box><Typography variant="caption" color="text.secondary">EMAIL</Typography><Typography variant="body2">{email}</Typography></Box></Stack>
          <Stack direction="row" spacing={1.2} alignItems="center"><BusinessOutlined fontSize="small" color="action" /><Box><Typography variant="caption" color="text.secondary">WORKSPACE</Typography><Typography variant="body2">{workspace}</Typography></Box></Stack>
          <Stack direction="row" spacing={1.2} alignItems="center"><BadgeOutlined fontSize="small" color="action" /><Box><Typography variant="caption" color="text.secondary">ROLE</Typography><Typography variant="body2">{title}</Typography></Box></Stack>
        </Stack>
        <Box className="profile-access-note"><ShieldOutlined fontSize="small" /><Typography variant="caption">{broker ? 'Demo access: manage requests and responses for assigned trader clients.' : 'Demo access: manage North Harbor Trading RFQs and respond to supplier offers.'}</Typography></Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.7, mt: 2 }}><AccountCircle fontSize="inherit" /> Profile details are sample data for this demo.</Typography>
      </DialogContent>
    </Dialog>
  );
}