import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button, Snackbar, SnackbarContent } from '@mui/material';

export const UpdatePrompt: React.FC = () => {
  const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log(`SW Registered: ${r}`);
    },
    onRegisterError(error: Error) {
      console.log('SW registration error', error);
    },
  });

  const handleClose = () => {
    offlineReady[1](false);
    needRefresh[1](false);
  };

  return (
    <Snackbar
      open={offlineReady[0] || needRefresh[0]}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <SnackbarContent
        message={
          offlineReady[0]
            ? 'App is ready to work offline.'
            : 'New content available, please refresh.'
        }
        action={
          needRefresh[0] && (
            <Button color="inherit" size="small" onClick={() => updateServiceWorker(true)}>
              Refresh
            </Button>
          )
        }
        sx={{ backgroundColor: 'primary.main' }}
      />
    </Snackbar>
  );
};