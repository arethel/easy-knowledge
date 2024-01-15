import React, { useEffect } from 'react';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

export default function MyAlert({ open, setOpen, severity, message, t }) {
  
  useEffect(() => {
    let timer;
    if (open) {
      timer = setTimeout(() => {
        setOpen(false);
      }, 4000); 
    }
    return () => clearTimeout(timer); 
  }, [open, setOpen]);

  return (
    <Collapse in={open}>
        <Alert
            severity={severity}
            action={
                <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                        setOpen(false);
                    }}
                >
                    <CloseIcon fontSize="inherit" />
                </IconButton>
            }
            sx={{ 
                width: '50%',
                fontSize: '0.875rem',
                position: 'absolute', 
                top: 0, 
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000 
            }}
        >
            {t(`${message.toLowerCase()}`)}
        </Alert>
    </Collapse>
  );
}
