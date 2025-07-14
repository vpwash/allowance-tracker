import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
// Remove unused Deduction import
import AddIcon from '@mui/icons-material/Add';
import { useAllowance } from '../../hooks/useAllowance';
import { ChildCard } from '../child/ChildCard';
import { ChildForm } from '../child/ChildForm';
import { DeductionForm } from '../deduction/DeductionForm';
import { formatCurrency } from '../../utils/formatters';
import type { AddChildFormData, UpdateChildFormData } from '../../types';
import type { ChildWithDeductions } from '../child/ChildCard';

export const Dashboard: React.FC = () => {
  const { 
    children, 
    addChild, 
    updateChild, 
    addDeduction, 
    getChild,
    payChild,
  } = useAllowance();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeductionDialogOpen, setIsDeductionDialogOpen] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [editingChild, setEditingChild] = useState<ChildWithDeductions | null>(null);

  const handleAddChild = async (data: AddChildFormData) => {
    await addChild(data);
    setIsAddDialogOpen(false);
  };

  const handleUpdateChild = async (data: UpdateChildFormData) => {
    if (editingChild) {
      console.log('handleUpdateChild called with data:', data);
      const updateData = {
        id: editingChild.id!,
        name: data.name,
        weeklyAllowance: data.weeklyAllowance,
        // Use initialBalance for both create and edit modes
        balance: data.balance !== undefined ? Number(data.balance) : (editingChild.balance || 0),
      };
      console.log('Updating child with data:', updateData);
      await updateChild(editingChild.id!, updateData);
      setIsEditDialogOpen(false);
      setEditingChild(null);
    }
  };

  const handleAddDeduction = async (data: { amount: number; reason: string }) => {
    if (selectedChildId) {
      await addDeduction(selectedChildId, data.amount, data.reason);
      setIsDeductionDialogOpen(false);
      setSelectedChildId(null);
    }
  };

  const handleEditClick = (child: ChildWithDeductions) => {
    setEditingChild(child);
    setIsEditDialogOpen(true);
  };

  const calculateTotalBalance = () => {
    return children.reduce((sum, child) => sum + child.balance, 0);
  };

  const selectedChild = selectedChildId ? getChild(selectedChildId) : null;

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'background.default',
      py: { xs: 2, sm: 3 },
      px: { xs: 0, sm: 4, md: 6 },
      width: '100%',
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }}>
      <Box sx={{ 
        width: '100%',
        maxWidth: '100vw',
        mx: 'auto',
        px: { xs: 2, sm: 0 },
      }}>
      <Box sx={{ 
        maxWidth: 1800,
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 },
      }}>
        

        {/* Balance Card */}
        <Paper sx={{ 
          p: 3, 
          mb: 4, 
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: 1
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" color="text.secondary">Total Balance</Typography>
              <Typography variant="h4" color="primary">
                {formatCurrency(calculateTotalBalance())}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Children Section */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h2">Children</Typography>
            <Box display="flex" alignItems="center" gap={2}>
              {children.length > 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => setIsAddDialogOpen(true)}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    boxShadow: 1,
                    '&:hover': {
                      boxShadow: 2
                    }
                  }}
                >
                  Add Child
                </Button>
              )}
              <Typography variant="body1" color="text.secondary">
                {children.length} {children.length === 1 ? 'Child' : 'Children'}
              </Typography>
            </Box>
          </Box>

          {children.length === 0 ? (
            <Paper 
              sx={{ 
                p: { xs: 3, sm: 4, md: 5 },
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh',
                maxWidth: '800px',
                mx: 'auto',
                my: 4,
                borderRadius: 2
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'medium' }}>
                No children added yet
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                paragraph
                sx={{ maxWidth: '600px', mb: 3 }}
              >
                Get started by adding your first child's information to track their allowance and deductions
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => setIsAddDialogOpen(true)}
                sx={{ 
                  mt: 1,
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  textTransform: 'none',
                  borderRadius: 2,
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4
                  }
                }}
              >
                Add Your First Child
              </Button>
            </Paper>
          ) : (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(auto-fill, minmax(300px, 1fr))',
                lg: 'repeat(auto-fill, minmax(350px, 1fr))' 
              }, 
              gap: { xs: 3, md: 4 },
              justifyItems: 'center',
              '& > *': {
                width: '100%',
                maxWidth: { sm: '400px', md: 'none' },
                justifySelf: 'stretch'
              }
            }}>
              {children.map((child) => {
                // Ensure child has an id before rendering ChildCard
                if (!child.id) {
                  console.error('Child is missing an id:', child);
                  return null;
                }
                return (
                  <Box key={child.id} sx={{ height: '100%' }}>
                    <ChildCard
                      child={{
                        ...child,
                        id: child.id!,
                        deductions: 'deductions' in child ? (child as any).deductions : []
                      } as ChildWithDeductions}
                      onEdit={() => handleEditClick(child as ChildWithDeductions)}
                      onDeduction={() => {
                        setSelectedChildId(child.id!);
                        setIsDeductionDialogOpen(true);
                      }}
                      onPay={payChild}
                    />
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      </Box>
    </Box>

      {/* Add Child Dialog */}
      <ChildForm
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddChild}
      />

      {/* Edit Child Dialog */}
      {editingChild && (
        <ChildForm
          open={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setEditingChild(null);
          }}
          onSubmit={handleUpdateChild}
          initialData={{
            id: editingChild.id,
            name: editingChild.name,
            weeklyAllowance: editingChild.weeklyAllowance,
            balance: editingChild.balance
          }}
          isEdit={true}
        />
      )}

      {selectedChild && (
        <DeductionForm
          open={isDeductionDialogOpen}
          onClose={() => {
            setIsDeductionDialogOpen(false);
            setSelectedChildId(null);
          }}
          onSubmit={handleAddDeduction}
          childName={selectedChild.name}
          currentBalance={selectedChild.balance}
          weeklyAllowance={selectedChild.weeklyAllowance}
        />
      )}
    </Box>
  );
};