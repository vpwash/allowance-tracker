import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// formatCurrency is not currently used but might be needed later
// import { formatCurrency } from '../../utils/formatters';

// Define the form values type
type FormValues = {
  name: string;
  weeklyAllowance: number;
  initialBalance?: number;
  balance?: number;
};

// Create the validation schema
const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  weeklyAllowance: yup
    .number()
    .typeError('Weekly allowance must be a number')
    .required('Weekly allowance is required')
    .min(0, 'Weekly allowance must be a positive number'),
  initialBalance: yup
    .number()
    .typeError('Initial balance must be a number')
    .min(0, 'Initial balance must be a positive number'),
  balance: yup
    .number()
    .typeError('Balance must be a number')
    .min(0, 'Balance must be a positive number'),
}).required();

interface FormData {
  name: string;
  weeklyAllowance: number;
  initialBalance?: number;
  balance?: number;
};

interface ChildFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void | Promise<void>;
  initialData?: {
    name: string;
    weeklyAllowance: number;
    balance?: number;
    id?: string;
  };
  isEdit?: boolean;
}

export const ChildForm: React.FC<ChildFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isEdit = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: yupResolver(schema) as any, // Type assertion to handle yup resolver type
    defaultValues: {
      name: initialData?.name || '',
      weeklyAllowance: initialData?.weeklyAllowance || 0,
      initialBalance: initialData?.balance || 0,
      balance: initialData?.balance || 0,
    },
  });

  useEffect(() => {
    if (open) {
      if (isEdit && initialData) {
        reset({
          name: initialData.name,
          weeklyAllowance: initialData.weeklyAllowance,
          balance: initialData.balance || 0,
        });
      } else {
        reset({
          name: '',
          weeklyAllowance: 10,
          initialBalance: 0,
        });
      }
    }
  }, [initialData, open, reset, isEdit]);

  const handleFormSubmit: SubmitHandler<FormValues> = async (formData: FormValues) => {
    try {
      console.log('Form submitted with data:', formData);
      setIsSubmitting(true);
      
      const submissionData: { name: string; weeklyAllowance: number; balance?: number; initialBalance?: number } = {
        name: formData.name,
        weeklyAllowance: formData.weeklyAllowance,
      };

      // In edit mode, include the balance in the updates
      if (isEdit && initialData?.id) {
        const balance = formData.balance ?? 0;
        console.log('In edit mode, setting balance to:', balance);
        submissionData.balance = balance;
      } else {
        // In create mode, set the initial balance
        const initialBalance = formData.initialBalance ?? 0;
        console.log('In create mode, setting initialBalance to:', initialBalance);
        submissionData.initialBalance = initialBalance;
      }

      console.log('Calling onSubmit with data:', submissionData);
      await onSubmit(submissionData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Child' : 'Add New Child'}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box mb={3}>
            {isEdit && (
              <Controller
                name="balance"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    label="Current Balance"
                    type="number"
                    fullWidth
                    variant="outlined"
                    error={!!errors.balance}
                    helperText={errors.balance?.message}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      inputProps: {
                        step: '0.01',
                        min: '-10000',
                        max: '10000'
                      },
                    }}
                    sx={{ mb: 2 }}
                  />
                )}
              />
            )}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoFocus
                  margin="dense"
                  label="Child's Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </Box>
          <Box mb={3}>
            <Controller
              name="weeklyAllowance"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label="Weekly Allowance"
                  type="number"
                  inputProps={{
                    step: '0.01',
                    min: '0',
                  }}
                  fullWidth
                  variant="outlined"
                  error={!!errors.weeklyAllowance}
                  helperText={errors.weeklyAllowance?.message}
                  disabled={isSubmitting}
                  InputProps={{
                    startAdornment: '$',
                  }}
                />
              )}
            />
          </Box>
          {!isEdit && (
            <Box mb={2}>
              <Controller
                name="initialBalance"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    label="Starting Balance (optional)"
                    type="number"
                    inputProps={{
                      step: '0.01',
                      min: '0',
                    }}
                    fullWidth
                    variant="outlined"
                    error={!!errors.initialBalance}
                    helperText={errors.initialBalance?.message}
                    disabled={isSubmitting}
                    InputProps={{
                      startAdornment: '$',
                    }}
                  />
                )}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Child'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
