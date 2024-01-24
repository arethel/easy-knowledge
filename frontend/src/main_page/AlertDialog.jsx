import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const AlertDialog = ({ open, handleClose, actionConfirmation, type, t }) => {
    const { id, name } = actionConfirmation;
    let title, description;
  
    if (type === 'Book') {
      title = t("delete-book");
      description = (
        <React.Fragment>
          {t('are-you-sure-you-want-to-delete-book')} 
          <span className='alert-element-name'>{name}</span>
          ?
        </React.Fragment>
      );
    } else if (type === 'Section') {
      title = t("delete-section");
      description = (
        <React.Fragment>
          {t('are-you-sure-you-want-to-delete-section')}  
          <span className='alert-element-name'>{name}</span>
           ?
        </React.Fragment>
      );
    }
  
    const handleConfirm = () => {
      handleClose(true);
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
              <Button onClick={handleCancel} variant="outlined">{t('cancel')}</Button>
              <Button onClick={handleConfirm} variant="outlined" color="error" autoFocus>
                {t('delete')}
              </Button>
          </DialogActions>
        </Dialog>
    );
}