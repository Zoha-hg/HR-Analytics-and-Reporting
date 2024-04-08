import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  homeContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    justifyContent: 'space-between',
    background: 'linear-gradient(to right, #39d6d3, #042434)',
    color: '#fff',
    fontFamily: 'Nunito, sans-serif',
    padding: '2em',
  },
  homeHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: '2em',
  },
  homeContent: {
    textAlign: 'left',
    marginBottom: '2em',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1em',
  },
  signUpButton: {
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
  },
  loginButton: {
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
  },
  homeFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.8em',
  },
}));

export default useStyles;
