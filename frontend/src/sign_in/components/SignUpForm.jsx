import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { makeStyles, withStyles } from '@mui/styles';
import { ReactComponent as GoogleLogo } from '../../images/google-logo.svg';
import "./style.css";

const useStyles = makeStyles({
  textField: {
    '& label.Mui-focused': {
      color: 'var(--collection-1-font-1) !important',
      outline: 'none !important',
    },
    "&:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px yellow inset !important",
      fontSize: "30px"
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'var(--collection-1-font-1) !important',
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--collection-1-font-1) !important',
    },
    '& .MuiInputBase-input': {
      color: 'white',
    },
    color: 'white !important',
    "& .MuiFormLabel-root": {
      color: "var(--collection-1-font-3)",
    },
    "& .MuiOutlinedInput-input":{
      color: "var(--collection-1-font-2)",
    }
  },
  checkbox: {
    color: 'var(--collection-1-font-1) !important',
  },
  button: {
    backgroundColor: 'var(--collection-1-font-1) !important',
    color: 'var(--collection-1-font-2) !important',
    '&:hover': {
      backgroundColor: 'var(--collection-1-blocks) !important',
    },
    marginBottom: '10px !important',
  },
  buttonGoogle: {
    color: 'var(--collection-1-font-2) !important',
    '&:hover': {
      backgroundColor: 'var(--collection-1-blocks) !important',
    }
  },
  link: {
    color: 'var(--collection-1-font-1) !important',
    '&:hover': {
      color: 'var(--collection-1-font-3) !important',
    },
  },
  typography: {
    color: 'var(--collection-1-font-2) !important',
  },
});

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'var(--collection-1-font-1)',
    },
    "& .MuiFormLabel-root": {
      color: "var(--collection-1-font-1)",
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'var(--collection-1-font-1)',
    },
    '& .MuiInputBase-input': {
      color: 'var(--collection-1-font-1)',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'var(--collection-1-blocks)',
      },
      '&:hover fieldset': {
        borderColor: 'var(--collection-1-font-1)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--collection-1-font-1)',
      },
      '&.MuiFormLabel-root': {
        color: 'var(--collection-1-font-1)',
      },
      '&:-webkit-autofill': { 
        '-webkit-text-fill-color': 'red',
        '-webkit-box-shadow': '0 0 0px 1000px red inset',
        transition: 'red 5000s ease-in-out 0s',
      },
    },
  },
})(TextField);

const CssFormControl = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'var(--collection-1-font-1)',
    },
    "& .MuiFormLabel-root": {
      color: "var(--collection-1-font-1)",
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'var(--collection-1-font-1)',
    },
    '& .MuiInputBase-input': {
      color: 'var(--collection-1-font-1)',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'var(--collection-1-blocks)',
      },
      '&:hover fieldset': {
        borderColor: 'var(--collection-1-font-1)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--collection-1-font-1)',
      },
      '&.MuiFormLabel-root': {
        color: 'var(--collection-1-font-1)',
      },
    },
  },
})(FormControl);

const defaultTheme = createTheme();

export default function SignInForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const classes = useStyles();

  function Copyright(props) {
    return (
      <Typography className={classes.typography} variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://chat.openai.com/">
          Easy Knowledge
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography className={classes.typography} component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <CssTextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <CssFormControl margin="normal" fullWidth variant="outlined">
              <InputLabel required htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                name="password"
                autoComplete="password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{ color: 'var(--collection-1-blocks)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </CssFormControl>
            <CssFormControl margin="normal" fullWidth variant="outlined">
              <InputLabel required htmlFor="password">Confirm Password</InputLabel>
              <OutlinedInput
                id="confirm-password"
                name="confirm-password"
                autoComplete="password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{ color: 'var(--collection-1-blocks)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm Password"
              />
            </CssFormControl>
            <FormControlLabel
              control={<Checkbox className={classes.checkbox} value="remember" color="primary" />}
              label={<Typography className={classes.checkbox} sx={{fontSize: '12px'}}>I want to receive marketing promotions and updates via email.</Typography>}
            />
            <Button
              className={classes.button}
              type="submit"
              fullWidth
              variant="contained"
              // sx={{ mt: 3, mb: 2, backgroundColor: 'rgba(92, 126, 146, 1)', color: '#fff' }}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <Link className={classes.link} href="#" variant="body2">
                  {"Have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                my: 1,
                width: '100%',
              }}
            >
              <Typography
                className={classes.typography}
                component="h6"
                variant="subtitle1"
                sx={{ fontSize: 12, color: 'var(--collection-1-blocks) !important' }}
              >
                - OR -
              </Typography>
            </Box>
            <Button
              className={classes.buttonGoogle}
              type="button"
              fullWidth
              variant="outlined"
              startIcon={<GoogleLogo className="google-logo" />}
              sx={{ pb: '10px', pt: '10px', textTransform: 'none', fontSize: '18px'}}
            >
              Sign up with Google
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}