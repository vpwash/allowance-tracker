
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import { theme } from './theme';
import { AllowanceProvider } from './context/AllowanceContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import { MainLayout } from './components/layout/MainLayout';
import { UpdatePrompt } from './components/pwa/UpdatePrompt';

// Lazy load components for code splitting
const Dashboard = lazy(() => import('./components/dashboard/Dashboard').then(module => ({ default: module.Dashboard })));
const Ledger = lazy(() => import('./components/ledger/Ledger').then(module => ({ default: module.Ledger })));

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="60vh"
  >
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider 
        maxSnack={3}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        autoHideDuration={3000}
      >
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <AllowanceProvider>
              <Router>
                <MainLayout>
                  <Switch>
                    <Route exact path="/">
                      <Dashboard />
                    </Route>
                    <Route path="/ledger">
                      <Ledger />
                    </Route>
                  </Switch>
                </MainLayout>
                <UpdatePrompt />
              </Router>
            </AllowanceProvider>
          </Suspense>
        </ErrorBoundary>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;