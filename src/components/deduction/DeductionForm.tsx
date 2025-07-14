import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { formatCurrency } from '../../utils/formatters';

const schema = yup.object({
  amount: yup
    .number()
    .typeError('Must be a valid number')
    .required('Amount is required')
    .positive('Must be a positive number')
    .max(1000, 'Amount seems too high'),
  reason: yup
    .string()
    .required('Reason is required')
    .min(3, 'Please provide a reason (at least 3 characters)'),
});

type FormData = yup.InferType<typeof schema>;

interface DeductionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  childName: string;
  currentBalance: number;
  weeklyAllowance: number;
}

export const DeductionForm: React.FC<DeductionFormProps> = ({
  open,
  onClose,
  onSubmit,
  childName,
  currentBalance,
  weeklyAllowance,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: 0,
      reason: '',
    },
  });

  const amount = watch('amount') || 0;
  const newBalance = Math.max(0, currentBalance - amount);

  const handleFormSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Error submitting deduction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Deduction for {childName}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box mb={3}>
            <Typography variant="body1" gutterBottom>
              Current Balance: {formatCurrency(currentBalance)}
            </Typography>
            {amount > 0 && (
              <Typography
                variant="body1"
                color={newBalance === 0 ? 'error' : 'text.primary'}
                gutterBottom
              >
                New Balance: {formatCurrency(newBalance)}
              </Typography>
            )}
          </Box>
          <Box mb={3}>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoFocus
                  margin="dense"
                  label="Deduction Amount"
                  type="number"
                  fullWidth
                  variant="outlined"
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                  disabled={isSubmitting}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    inputProps: {
                      step: '0.01',
                      min: '0'
                    },
                  }}
                />
              )}
            />
            <Box display="flex" justifyContent="flex-end" mt={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  const oneDayAmount = Number((weeklyAllowance / 7).toFixed(2));
                  setValue('amount', oneDayAmount, { shouldValidate: true });
                }}
                disabled={isSubmitting || weeklyAllowance <= 0}
                sx={{ 
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  minWidth: 'auto',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                1 Day (${(weeklyAllowance / 7).toFixed(2)})
              </Button>
            </Box>
          </Box>
          <Box mb={2}>
            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label="Reason for Deduction"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={!!errors.reason}
                  helperText={errors.reason?.message || 'Why is this deduction being made?'}
                  disabled={isSubmitting}
                  multiline
                  rows={3}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="error"
            disabled={isSubmitting || amount <= 0}
          >
            {isSubmitting ? 'Processing...' : 'Deduct from Allowance'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
