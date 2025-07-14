import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { ThemeProvider } from '@mui/material/styles';
import { Link, useLocation } from 'react-router-dom';
import { theme } from '../../theme';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" color="primary" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Allowance Tracker
            </Typography>
            <Tabs
              value={location.pathname}
              textColor="inherit"
              indicatorColor="secondary"
              sx={{ 
                '& .Mui-selected': {
                  borderBottom: '2px solid',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                '& .MuiTab-root:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <Tab label="Dashboard" value="/" to="/" component={Link} />
              <Tab label="Ledger" value="/ledger" to="/ledger" component={Link} />
            </Tabs>
          </Toolbar>
        </AppBar>
        <Container component="main" sx={{ flex: 1, py: 4, px: { xs: 2, sm: 3 } }}>
          {children}
        </Container>
        <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'background.paper' }}>
          <Container maxWidth="sm">
            <Typography variant="body2" color="text.secondary" align="center">
              © {new Date().getFullYear()} Allowance Tracker
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
