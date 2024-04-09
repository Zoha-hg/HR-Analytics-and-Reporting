import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    background: 'linear-gradient(to right, #39d6d3, #042434)',
  },
  homeContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    minHeight: '100vh',
    color: '#fff',
    fontFamily: 'Nunito, sans-serif',
    padding: '2em',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '2em',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.8em',
    width: '100%',
    paddingLeft: '2em',
    paddingRight: '2em',
    marginTop: 'auto',
  },
  logo: {
    width: '150px',
    height: 'auto',
  },
  brandName: {
    fontSize: '1.5em', 
    marginLeft: '0.5em', 
    verticalAlign: 'middle',
  },
  rightContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    marginTop: '2em',
    marginBottom: '2em',
  },
  leftContainer: {
    // textAlign: 'left',
    alignItems: 'center',
    margin: 'auto',
    marginTop: '2em',
    marginBottom: '2em',
  },
  signUpButton: {
    textAlign: 'center',
    marginRight: '1em',
    fontSize: '1.5em', // Increase button font size
    padding: '1em 2em',
    backgroundColor: '#fff', // Set button background color to white
    color: '#000', // Set button text color to black
    marginTop: '1em', // Add spacing between text and button
  },
  loginButton: {
    fontSize: '1.5em', // Increase button font size
    padding: '1em 2em',
    backgroundColor: '#fff', // Set button background color to white
    color: '#000', // Set button text color to black
  },
}));

export default useStyles;
