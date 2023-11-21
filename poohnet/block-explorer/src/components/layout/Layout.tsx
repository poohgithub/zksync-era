import React from 'react';
import Footer from './Footer';
import Header from './Header';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';

function Layout() {
  const location = useLocation();
  const pathName = location.pathname;
  return (
    <Box>
      {pathName !== '/signin' ? <Header /> : null}
      <Container
        maxW="lg"
        py={{ base: '12', md: '24' }}
        px={{ base: '0', sm: '8' }}
      >
        <Outlet />
      </Container>
      {pathName !== '/signin' ? <Footer /> : null}
    </Box>
  );
}

export default Layout;
