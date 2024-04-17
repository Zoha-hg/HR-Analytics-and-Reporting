import { createTheme } from '@mui/material/styles';


const theme = createTheme({
  palette: {
    primary: {
      main: '#39d6d3', // primary colour.
      secondary: 'linear-gradient(to right, #39d6d3, #042434)', // secondary colour.
    },
    secondary: {
      main: '#042434', // secondary colour.
    },
    error: {
      main: '#FF7F7F', // error colour.
    },
  },
  typography: {
    fontFamily: 'Nunito, Manrope, sans-serif', // font family. 
  },
  shape: {
    borderRadius: 20, // button border radius.
  },
});

export default theme;