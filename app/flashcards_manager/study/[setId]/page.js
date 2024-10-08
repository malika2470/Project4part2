'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { Container, Typography, Box, Button, AppBar, Toolbar } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useSwipeable } from 'react-swipeable';
import { UserButton } from '@clerk/nextjs';

export default function StudyMode() {
    const { setId } = useParams();
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [currentCard, setCurrentCard] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchFlashcardSet() {
            if (!user || !setId) return;
    
            setLoading(true);
            setError(null);
    
            try {
                // Reference the specific flashcard set document in Firestore
                const flashcardSetDocRef = doc(db, 'users', user.id, 'flashcard_sets', setId);
                const docSnapshot = await getDoc(flashcardSetDocRef);
    
                if (docSnapshot.exists()) {
                    const flashcardSetData = docSnapshot.data();
                    setFlashcards(flashcardSetData.flashcards || []);
                } else {
                    setError('Flashcard set not found.');
                }
            } catch (error) {
                console.error('Error fetching flashcard set:', error);
                setError('Failed to load flashcard set. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
    
        if (isLoaded && isSignedIn) {
            fetchFlashcardSet();
        } else {
            setLoading(false);
            setError('You must be signed in to view and study flashcards.');
        }
    }, [user, isLoaded, isSignedIn, setId]);
    

    const handleFlip = () => {
        setFlipped(!flipped);
    };

    const handleNext = () => {
        if (currentCard < flashcards.length - 1) {
            setCurrentCard((prev) => prev + 1);
            setFlipped(false);  // Reset to front side when moving to the next card
        }
    };

    const handlePrevious = () => {
        if (currentCard > 0) {
            setCurrentCard((prev) => prev - 1);
            setFlipped(false);  // Reset to front side when moving to the previous card
        }
    };

    const handlers = useSwipeable({
        onSwipedLeft: handleNext,
        onSwipedRight: handlePrevious,
    });

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowRight') {
                handleNext();
            } else if (event.key === 'ArrowLeft') {
                handlePrevious();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentCard]);

    if (!isLoaded || !isSignedIn || loading) {
        return (
            <Container maxWidth="sm">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Typography>Loading...</Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm">
                <Typography variant="h6" align="center" sx={{ mt: 4, color: 'red' }}>
                    {error}
                </Typography>
            </Container>
        );
    }

    if (flashcards.length === 0) {
        return (
            <Container maxWidth="sm">
                <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                    No flashcards found in this set.
                </Typography>
            </Container>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#E3F2FD' }}>
            {/* Header */}
            <AppBar position="static" sx={{ backgroundColor: '#3F51B5', boxShadow: 'none', mb: 4 }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 'bold', fontFamily: "'Lato', sans-serif", cursor: 'pointer' }}
                        onClick={() => router.push('/flashcards_manager/view')}
                    >
                        FlipSmart
                    </Typography>
                    <UserButton />
                </Toolbar>
            </AppBar>

            <Container
                maxWidth="md"
                sx={{
                    mt: 4,
                    textAlign: 'center',
                    backgroundColor: '#FFFFFF',
                    minHeight: '70vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
                {...handlers}
            >
                <Typography
                    variant="h4"
                    sx={{
                        mb: 4,
                        fontFamily: 'Lato, sans-serif',
                        color: '#3F51B5',
                        fontWeight: 'bold',
                    }}
                >
                    Study Mode
                </Typography>
                <Box
    sx={{
        width: '100%',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        boxSizing: 'border-box',
        textAlign: 'center',
        borderRadius: '12px',
        transformStyle: 'preserve-3d',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        transition: 'transform 0.6s ease',
        position: 'relative',
    }}
    onClick={handleFlip}
>
    <Box
        sx={{
            width: '100%',
            minHeight: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
        }}
    >
        <Typography
            variant="h3"
            sx={{
                fontFamily: 'Lato, sans-serif',
                color: '#3F51B5',
            }}
        >
            {flashcards[currentCard].front}
        </Typography>
    </Box>
    <Box
        sx={{
            width: '100%',
            minHeight: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
        }}
    >
        <Typography
            variant="h3"
            sx={{
                fontFamily: 'Lato, sans-serif',
                color: '#3F51B5',
            }}
        >
            {flashcards[currentCard].back}
        </Typography>
    </Box>
</Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 4,
                        width: '100%',
                        maxWidth: '600px',
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handlePrevious}
                        sx={{ backgroundColor: '#42A5F5', '&:hover': { backgroundColor: '#1E88E5' } }}
                        disabled={currentCard === 0}
                    >
                        Previous
                    </Button>
                    {currentCard < flashcards.length - 1 ? (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            sx={{ backgroundColor: '#42A5F5', '&:hover': { backgroundColor: '#1E88E5' } }}
                        >
                            Next
                        </Button>
                    ) : (
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: 'Lato, sans-serif',
                                color: '#3F51B5',
                                fontWeight: 'bold',
                                alignSelf: 'center',
                                mt: 2,
                            }}
                        >
                            You've completed the set!
                        </Typography>
                    )}
                </Box>
            </Container>
        </Box>
    );
}
