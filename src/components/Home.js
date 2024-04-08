import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Container } from '@mui/material';

const Home = () => {
  return (
    <Container sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      justifyContent: 'space-between',
      background: 'linear-gradient(to right, #39d6d3, #042434)',
      color: '#fff',
      fontFamily: 'Nunito, sans-serif',
      padding: '2em',
    }}>
      <header sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: '2em',
      }}>
        <Typography variant="h1">Welcome to HR Data Drive</Typography>
        <Typography variant="body1">Your one-stop solution for HR analytics and reporting.</Typography>
      </header>
      <section sx={{
        textAlign: 'left',
        marginBottom: '2em',
      }}>
        <Typography variant="h3">Harness the power of data to optimize your workforce, improve decision-making, and drive success.</Typography>
      </section>
      <section sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1em',
      }}>
        <Button component={Link} to="/signup" sx={{
          borderRadius: '5px',
          background: '#fff',
          color: '#000',
          textDecoration: 'none',
          fontWeight: 'bold',
          padding: '10px 20px',
          border: '1px solid #fff',
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: '#e0e0e0',
            color: '#000',
          },
        }}>
          Sign Up
        </Button>
        <Button component={Link} to="/login" sx={{
          borderRadius: '5px',
          color: '#fff',
          textDecoration: 'none',
          fontWeight: 'bold',
          padding: '10px 20px',
          border: '1px solid #fff',
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: '#39d6d3',
            color: '#000',
          },
        }}>
          Login
        </Button>
      </section>
      <footer sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.8em',
      }}>
        <Typography>&copy; 2024 Data Darbar</Typography>
        <nav sx={{ display: 'flex', gap: '1em' }}>
          <Button component={Link} to="/">Home</Button>
          <Button component={Link} to="/contact">Contact</Button>
        </nav>
      </footer>
    </Container>
  );
};

export default Home;
