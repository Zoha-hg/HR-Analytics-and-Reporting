import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#ffff',
  },
  container: {
    // display: 'flex',
    // alignItems: 'stretch', // Stretch the items vertically
    // justifyContent: 'space-evenly', // Stretch the items horizontally
    // width: '100%',
    // height: '100vh',
    // backgroundColor: '#ffff',
    // overflow: 'auto'
    flexGrow: 1,
  },
  drawerPaper: {
    background: 'linear-gradient(to bottom, #39d6d3, #042434)',
  },
  mainContent: {
    flexGrow: 1,
    padding: theme.spacing(2),
    minHeight: '100%',
    backgroundColor: '#ffff',
  },
  cards: {
    padding: theme.spacing(3),
    textColor: '#fff',
  },
  firstRow: {
    direction: 'row',
  },
  stack: {
    // direction: 'column',
  },
  secondRow: {
    direction: 'row',
  },
  cardItem: {
    color: '#fff',
    padding: theme.spacing(1),
  },
}));
// const useStyles = () => {};
export default useStyles;
