import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    background: 'linear-gradient(to right, #39d6d3, #042434)',
    minHeight: '100%', // Ensure gradient fills the entire viewport
    fontFamily: 'Nunito, sans-serif',

  },
  homeContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    minHeight: '100vh',
    color: '#fff',
    fontFamily: 'Nunito, sans-serif',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.8em',
    width: '100%',
    paddingLeft: '2em',
    paddingRight: '2em',
  },
  logo: {
    width: '100px',
    height: 'auto',
    marginLeft: '2em',
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
    // margin: 'auto',
    // marginTop: '2em',
    // marginBottom: '2em',
  },
  leftContainer: {
    textAlign: 'left',
    alignItems: 'center',
  },
}));

export default useStyles;
