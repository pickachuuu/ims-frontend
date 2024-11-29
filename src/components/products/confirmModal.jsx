import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
                <p>{message}</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="secondary">
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmModal;