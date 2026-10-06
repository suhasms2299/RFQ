import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useRfqs } from '../../hooks/useRfqs';
import { counterparties, traderAccounts } from '../../data/mockRfqs';
import { RfqFormValues, UserRole } from '../../types';

const commodities = ['Crude Oil', 'Wheat', 'Gold', 'LNG', 'Palm Oil'];

export const rfqSchema = z.object({
  traderAccount: z.string(),
  commodity: z.string().min(1, 'Choose a commodity'),
  startDate: z.string().min(1, 'Choose a start date'),
  endDate: z.string().min(1, 'Choose an end date'),
  validUntil: z.string().min(1, 'Set the quote expiry date and time'),
  price: z.string().min(1, 'Enter a target price').refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, 'Price must be greater than zero'),
  quantity: z.string().min(1, 'Enter a quantity').refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, 'Quantity must be greater than zero'),
  description: z.string().min(8, 'Add at least 8 characters of terms or specifications'),
  counterparties: z.array(z.string()).min(1, 'Invite at least one counterparty'),
}).superRefine((values, context) => {
  if (values.startDate && values.endDate && values.endDate < values.startDate) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['endDate'], message: 'End date must be on or after the start date' });
  }
  if (values.validUntil && new Date(values.validUntil).getTime() <= Date.now()) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['validUntil'], message: 'Expiry must be in the future' });
  }
});

type RFQFormProps = {
  open: boolean;
  role: UserRole;
  onClose: () => void;
};

const defaultValues: RfqFormValues = {
  traderAccount: traderAccounts[0],
  commodity: '',
  startDate: '',
  endDate: '',
  validUntil: '',
  price: '',
  quantity: '',
  description: '',
  counterparties: [],
};

export default function RFQForm({ open, role, onClose }: RFQFormProps) {
  const { createRfq } = useRfqs();
  const navigate = useNavigate();
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<RfqFormValues>({
    resolver: zodResolver(rfqSchema),
    defaultValues,
  });
  const commodity = useWatch({ control, name: 'commodity' });
  const priceUnit = commodity === 'Crude Oil' || commodity === 'Palm Oil' ? 'Liter' : 'Metric Ton';

  const close = () => {
    reset(defaultValues);
    onClose();
  };

  const submit = (values: RfqFormValues) => {
    const rfq = createRfq(values, role);
    close();
    navigate(`/${role}/rfq/${rfq.id}`);
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="md" aria-labelledby="rfq-form-title">
      <DialogTitle id="rfq-form-title" sx={{ pb: 0.5, fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif", fontSize: 24, fontWeight: 600 }}>Create a request for quote</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" variant="body2" sx={{ mb: 2.5 }}>Set your commercial terms and invite counterparties to bid.</Typography>
        <Stack component="form" id="rfq-create-form" onSubmit={handleSubmit(submit)} spacing={2}>
          {role === 'broker' && <TextField select label="Trader account" {...register('traderAccount')} defaultValue={defaultValues.traderAccount} error={Boolean(errors.traderAccount)} helperText={errors.traderAccount?.message}>
            {traderAccounts.map((account) => <MenuItem key={account} value={account}>{account}</MenuItem>)}
          </TextField>}

          <Controller name="commodity" control={control} render={({ field }) => (
            <Autocomplete options={commodities} value={field.value || null} onChange={(_, value) => field.onChange(value ?? '')} renderInput={(params) => <TextField {...params} label="Commodity" placeholder="Search commodities" error={Boolean(errors.commodity)} helperText={errors.commodity?.message} />} />
          )} />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField {...register('startDate')} label="Start date" type="date" InputLabelProps={{ shrink: true }} error={Boolean(errors.startDate)} helperText={errors.startDate?.message} fullWidth />
            <TextField {...register('endDate')} label="End date" type="date" InputLabelProps={{ shrink: true }} error={Boolean(errors.endDate)} helperText={errors.endDate?.message} fullWidth />
            <TextField {...register('validUntil')} label="Quotes valid until" type="datetime-local" InputLabelProps={{ shrink: true }} error={Boolean(errors.validUntil)} helperText={errors.validUntil?.message} fullWidth />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField {...register('price')} label={`Target price (USD / ${priceUnit})`} type="number" inputProps={{ min: 0, step: 'any' }} error={Boolean(errors.price)} helperText={errors.price?.message} fullWidth />
            <TextField {...register('quantity')} label={`Quantity (${priceUnit === 'Liter' ? 'Liters' : 'Metric Tons'})`} type="number" inputProps={{ min: 0, step: 'any' }} error={Boolean(errors.quantity)} helperText={errors.quantity?.message} fullWidth />
          </Stack>

          <TextField {...register('description')} label="Description and terms" placeholder="Delivery terms, grade, purity, quality specifications..." multiline minRows={3} error={Boolean(errors.description)} helperText={errors.description?.message} />

          <Controller name="counterparties" control={control} render={({ field }) => (
            <Autocomplete multiple options={counterparties} value={field.value} onChange={(_, value) => field.onChange(value)} renderInput={(params) => <TextField {...params} label="Suggested traders and counterparties" placeholder="Select firms to invite" error={Boolean(errors.counterparties)} helperText={errors.counterparties?.message} />} />
          )} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={close} color="inherit">Cancel</Button>
        <Button type="submit" form="rfq-create-form" variant="contained" disabled={isSubmitting}>Publish RFQ</Button>
      </DialogActions>
    </Dialog>
  );
}