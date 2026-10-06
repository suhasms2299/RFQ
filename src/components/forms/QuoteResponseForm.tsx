import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack, Switch, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

export const responseSchema = z.object({
  price: z.string().refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, 'Enter a price greater than zero'),
  negotiable: z.boolean(),
  description: z.string().min(8, 'Add at least 8 characters describing your response'),
});

export type QuoteResponseDraft = z.infer<typeof responseSchema>;

type QuoteResponseFormProps = {
  open: boolean;
  counterparty: string;
  initialPrice: number;
  unit: string;
  onClose: () => void;
  onSubmit: (response: QuoteResponseDraft) => void;
};

export default function QuoteResponseForm({ open, counterparty, initialPrice, unit, onClose, onSubmit }: QuoteResponseFormProps) {
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<QuoteResponseDraft>({
    resolver: zodResolver(responseSchema),
    defaultValues: { price: String(initialPrice), negotiable: false, description: '' },
  });

  useEffect(() => {
    if (open) reset({ price: String(initialPrice), negotiable: false, description: '' });
  }, [initialPrice, open, reset]);

  const close = () => {
    reset({ price: String(initialPrice), negotiable: false, description: '' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm" aria-labelledby="quote-response-title">
      <DialogTitle id="quote-response-title" sx={{ fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif", fontSize: 23, fontWeight: 600, pb: 0.5 }}>Respond to {counterparty}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Send your commercial response. The supplier’s original offer will remain on record.</Typography>
        <Stack component="form" id="quote-response-form" onSubmit={handleSubmit(onSubmit)} spacing={2}>
          <TextField {...register('price')} autoFocus type="number" label={`Your price (USD / ${unit})`} inputProps={{ min: 0, step: 'any' }} error={Boolean(errors.price)} helperText={errors.price?.message} />
          <Controller name="negotiable" control={control} render={({ field }) => <FormControlLabel control={<Switch checked={field.value} onChange={(_, checked) => field.onChange(checked)} color="secondary" />} label="Price is negotiable" />} />
          <TextField {...register('description')} label="Response description" placeholder="Terms, delivery notes, or context for your price" multiline minRows={3} error={Boolean(errors.description)} helperText={errors.description?.message} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={close} color="inherit">Cancel</Button>
        <Button type="submit" form="quote-response-form" variant="contained" color="secondary" disabled={isSubmitting}>Send response</Button>
      </DialogActions>
    </Dialog>
  );
}