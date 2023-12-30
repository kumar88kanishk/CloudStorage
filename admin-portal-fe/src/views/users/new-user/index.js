import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import AddIcon from '@mui/icons-material/Add';
import RegistrationForm from './form';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const NewUserDialog = (props) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen} disableElevation sx={{ color: 'white' }} startIcon={<AddIcon />}>
                Add user
            </Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                maxWidth='xs'
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Create new user"}</DialogTitle>
                <DialogContent>
                    <RegistrationForm close={handleClose} />
                </DialogContent>
            </Dialog>
        </div>
    );
}



export default NewUserDialog;
