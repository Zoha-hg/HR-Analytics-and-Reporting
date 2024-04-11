import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#ffff',
  },
  drawerPaper: {
    width: 240,
    background: 'linear-gradient(to bottom, #39d6d3, #042434)',
    color: 'white',
  },
  drawerItem: {
    color: '#fff', // Set the text color to white
  },
  mainContent: {
    flexGrow: 1,
    padding: theme.spacing(3),
    minHeight: '100vh',
  },
}));

export default useStyles;
