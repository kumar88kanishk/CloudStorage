
import * as React from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Block from '@mui/icons-material/Block';
import network from 'helpers/network.helper';
import { user } from 'constants/api.constants';
import LinearProgress from '@mui/material/LinearProgress';
import { useSnackbar } from 'notistack';
import Grow from '@material-ui/core/Grow';

const BlockUserConfirmationDialog = (props) => {
    const [open, setOpen] = React.useState(false);

    const { enqueueSnackbar } = useSnackbar()

    const [loading, setLoading] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const updateUser = () => {
        setLoading(true);
        network.patch(user.updateUser(props.user._id), { isBlocked: !props.user.isBlocked })
            .then(() => {
                enqueueSnackbar(props.user.isBlocked ? 'User is unblocked' : 'User is blocked', {
                    variant: 'success', anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                    TransitionComponent: Grow,
                });
                setLoading(false);
                handleClose();
                props.refreshUsers();
            }).catch((err) => {
                enqueueSnackbar('Something went wrong', {
                    variant: 'error', anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                    TransitionComponent: Grow,
                });
                setLoading(false);
            });
    }

    return (
        <div>

            <ButtonBase
                variant="rounded"
                onClick={handleClickOpen}
                sx={{
                    background: theme => props.user.isBlocked ? 'red' : theme.palette.primary.light,
                    color: theme => props.user.isBlocked ? 'white' : theme.palette.secondary.dark,
                    borderRadius: "12px",
                    p: 1,
                }}>
                <Block fontSize="inherit" />
            </ButtonBase>
            <Dialog
                open={open}
                maxWidth='xs'
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {loading ?? <LinearProgress />}
                <DialogTitle id="alert-dialog-title">
                    {props.user.isBlocked ? 'Are you sure want to unblock user?' : 'Are you sure want to block the user?'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {props.user.isBlocked ? 'After unblocking, user will be able to login or perform any actions to the account' : 'After blocking, user will not be able to login or perform any actions to the account'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        disabled={loading}
                        onClick={handleClose}>Cancel</Button>
                    <Button
                        onClick={updateUser}
                        disabled={loading}
                        variant='contained'
                        disableElevation
                        sx={{ color: 'white' }}>
                        {props.user.isBlocked ? 'Unblock' : 'Block'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default BlockUserConfirmationDialog;
