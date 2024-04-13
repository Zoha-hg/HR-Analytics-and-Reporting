import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    // minHeight: '100vh',
    // fontFamily: 'Nunito, sans-serif',
    // margin: 0,
    // padding: 0,
    // display: 'flex',
    // flexDirection: 'column',
    // overflow: 'hidden',
  },
  homeContainer: {
    background: 'linear-gradient(to right, #39d6d3, #042434)',
    // position: 'fixed',
    display: 'flex',
    flexDirection: 'row',
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
    alignItems: 'flex-end',
    fontSize: '0.8em',
    width: '100%',
    paddingLeft: '2em',
    paddingRight: '2em',
    padding: '1em',
    boxSizing: 'border-box',
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
  },
  leftContainer: {
    textAlign: 'left',
    alignItems: 'center',
  },
}));

export default useStyles;
