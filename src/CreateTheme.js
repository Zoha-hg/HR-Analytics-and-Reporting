import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#39d6d3', // primary colour.
    },
    secondary: {
      main: '#042434', // secondary colour.
    },
  },
  typography: {
    fontFamily: 'Nunito, sans-serif, Manrope' , 
  },
  shape: {
    borderRadius: 20, // button border radius.
  },
});

export default theme;