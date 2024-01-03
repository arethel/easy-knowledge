import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const AlertDialog = ({ open, handleClose, actionConfirmation, type }) => {
    const { id, name } = actionConfirmation;
    let title, description;
  
    if (type === 'deleteBook') {
      title = "Delete Book";
      description = (
        <React.Fragment>
          Are you sure you want to delete Book 
          <span className='alert-element-name'>{name}</span>
          ?
        </React.Fragment>
      );
    } else if (type === 'deleteSection') {
      title = "Delete Section";
      description = (
        <React.Fragment>
          Are you sure you want to delete Section 
          <span className='alert-element-name'>{name}</span>
           ?
        </React.Fragment>
      );
    }
  
    const handleConfirm = () => {
      if (type === 'deleteBook') {
      } else if (type === 'deleteSection') {
        handleClose(true);
      }
    };
  
    const handleCancel = () => {
      handleClose(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{ sx: { bgcolor: "var(--collection-1-blocks)", borderRadius: '10px' } }}
        >
          <DialogTitle sx={{ color: 'background.paper' }} id="alert-dialog-title">
          {title}
          </DialogTitle>
          <DialogContent>
              <DialogContentText sx={{ color: 'background.paper' }} id="alert-dialog-description">
                  {description}
              </DialogContentText>
          </DialogContent>
          <DialogActions>
              <Button onClick={handleCancel} variant="outlined">Cancel</Button>
              <Button onClick={handleConfirm} variant="outlined" color="error" autoFocus>
                  Delete
              </Button>
          </DialogActions>
        </Dialog>
    );
}