import * as React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { makeStyles, withStyles } from '@mui/styles';

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

export default function Copyright({ props }) {
    const classes = useStyles();
    return (
      <Typography className={classes.typography} variant="body2" color="var(--collection-1-blocks) !important" align="center" sx={{ position: 'absolute', bottom: 30, textAlign: 'center', alignItems: 'center', justifyContent: 'center' }} {...props} >
        {'Copyright © '}
        <Link color="inherit" href="">
          Easy Knowledge
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
}