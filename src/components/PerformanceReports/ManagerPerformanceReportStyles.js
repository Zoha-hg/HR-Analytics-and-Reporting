import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing(3),
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },
    paper: {
        margin: theme.spacing(2),
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        border: '1px solid #e0e0e0', // You can adjust the color as needed
        [theme.breakpoints.up('md')]: {
            width: '80%',
        },
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
}));

export default useStyles;
