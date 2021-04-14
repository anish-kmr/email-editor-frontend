import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
        light:"#4e4f8f",
        main:"#1e2761",
        dark:"#000037"
    },
    secondary:{
        light:"#ac4f73",
        main:"#7a2048",
        dark:"#4a0021",
    },
  },
});

export default theme;