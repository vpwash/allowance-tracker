
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoneyIcon from '@mui/icons-material/AttachMoney';
import PaidIcon from '@mui/icons-material/Paid';
import { formatCurrency } from '../../utils/formatters';
import type { ChildProfile } from '../../types';
import { useAllowance } from '../../hooks/useAllowance';

export interface Deduction {
  amount: number;
  reason: string;
  date: string;
  id: string;
}

export interface ChildWithDeductions extends ChildProfile {
  deductions: Deduction[];
}

interface ChildCardProps {
  child: ChildWithDeductions;
  onEdit: () => void;
  onDeduction: () => void;
  onPay: (childId: string) => void;
}

export const ChildCard: React.FC<ChildCardProps> = ({ child, onEdit, onDeduction, onPay }) => {
  const { removeChild } = useAllowance();
  const totalDeductions = child.deductions.reduce((sum: number, d: Deduction) => sum + d.amount, 0);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h5" component="div">
            {child.name}
          </Typography>
          <Box>
            <Tooltip title="Edit">
              <IconButton onClick={onEdit} size="small" color="primary" sx={{ mr: 1 }}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Pay Balance">
              <IconButton 
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Mark ${child.name}'s balance as paid?`) && child.id) {
                    onPay(child.id);
                  }
                }} 
                size="small" 
                color="success"
                disabled={child.balance <= 0}
                sx={{ mr: 1 }}
              >
                <PaidIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton 
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Are you sure you want to remove ${child.name}?`) && child.id) {
                    removeChild(child.id);
                  }
                }} 
                size="small" 
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box mb={2}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color="text.secondary">Current Balance:</Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatCurrency(child.balance)}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color="text.secondary">Weekly Allowance:</Typography>
            <Typography variant="body1">
              {formatCurrency(child.weeklyAllowance)}
            </Typography>
          </Box>
          {totalDeductions > 0 && (
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="error">Total Deductions:</Typography>
              <Typography variant="body2" color="error">
                -{formatCurrency(totalDeductions)}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
      <Box p={2} pt={0} display="flex" justifyContent="flex-end">
        <Tooltip title="Add Deduction">
          <IconButton 
            onClick={(e) => {
              e.stopPropagation();
              onDeduction();
            }} 
            color="error"
            size="small"
            sx={{ mr: 1 }}
          >
            <MoneyIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};
