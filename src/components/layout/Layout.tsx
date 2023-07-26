import React from 'react';
import Navbar from '../NavBar';
import { Container, Box, CssBaseline } from '@mui/material';

type LayoutProps = {
    children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    return (
        <>
            <CssBaseline />
            <Navbar />
            <Container>
                <Box my={2}>
                    {children}
                </Box>
            </Container>
        </>
    );
}

export default Layout;
