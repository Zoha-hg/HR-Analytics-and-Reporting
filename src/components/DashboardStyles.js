import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#ffff',
  },
  container: {
    display: 'flex',
    // alignItems: 'stretch', // Stretch the items vertically
    justifyContent: 'space-evenly', // Stretch the items horizontally
    width: '100%',
    height: '100vh',
    backgroundColor: '#ffff',
  },
  drawerPaper: {
    background: 'linear-gradient(to bottom, #39d6d3, #042434)',
  },
  drawerItem: {
    color: '#fff',
  },
  mainContent: {
    flexGrow: 1,
    padding: theme.spacing(2),
    minHeight: '100vh',
    backgroundColor: '#ffff',
  },
  cards: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    padding: theme.spacing(2),
  },
}));

export default useStyles;
