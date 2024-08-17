import { AppBar, Typography, Container, Button, Toolbar, Box } from '@mui/material';
import Link from 'next/link'; // Correctly import Link from next/link
import { SignIn } from '@clerk/nextjs'; // Importing Clerk's SignIn component

export default function SignInPage() {
    return (
        <Container 
            maxWidth="false" 
            disableGutters 
            sx={{ 
                minHeight: '100vh', 
                backgroundColor: '#E3F2FD', 
                padding: '0', 
                display: 'flex', 
                flexDirection: 'column' 
            }}
        >
            <AppBar position="static" sx={{ backgroundColor: '#3F51B5' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: 'Roboto, sans-serif' }}>
                        FlipSmart
                    </Typography>
                    <Link href="/sign-up" passHref>
                        <Button color="inherit">Sign Up</Button>
                    </Link>
                </Toolbar>
            </AppBar>

            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 8, flexGrow: 1 }}
            >
                <Typography variant="h4" sx={{ color: '#3F51B5', mb: 4 }}>
                    Sign In
                </Typography>
                <Box 
                    sx={{ 
                        backgroundColor: '#D1C4E9', 
                        padding: '20px', 
                        borderRadius: '10px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' 
                    }}
                >
                    <SignIn />
                </Box>
            </Box>
        </Container>
    );
}
