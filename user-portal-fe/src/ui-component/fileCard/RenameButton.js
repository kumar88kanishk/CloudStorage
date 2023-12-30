import * as React from 'react';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';
import { useDispatch, useSelector } from "react-redux";
import { Grow } from '@mui/material';
import RenameIcon from 'assets/images/icons/rename-icon.svg'
import { Typography } from '@mui/material';
import { fileRename } from 'store/actions/browser.action';
import Box from '@mui/system/Box';
import { useSnackbar } from 'notistack';


const RenameObject = (props) => {

  const dispatch = useDispatch();

  const controller = useSelector((state) => state.browser);

  const [open, setOpen] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = React.useState(false);

  const [name, setName] = React.useState(props.name);

  const [error, setError] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const updateName = () => {
    var format = /[+\-=[\]{};':"\\|<>/?]+/;
    if (name && name.length > 0 && name !== props.name && !format.test(name)) {
      setLoading(true);
      console.log('current hash', props.hash);
      dispatch(fileRename(props.hash, name.replace(props.extension, '') + props.extension, controller.pathKey)).then((e) => {
        setLoading(false);
        enqueueSnackbar(`"${props.name}" renamed to "${name}"`, {
          variant: 'success', anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          TransitionComponent: Grow,
        });
        handleClose();
      }).catch((e) => {
        setLoading(false);
        if (e.response && e.response.data) {
          enqueueSnackbar(e.response.data.info.message, {
            variant: 'error', anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            TransitionComponent: Grow,
          });
        } else {
          enqueueSnackbar("Something went wrong!!", {
            variant: 'error', anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            TransitionComponent: Grow,
          });
        }
      })

    } else {
      setError("Enter valid name");
    }
  };

  const handelOnChange = (e) => {
    setError(null);
    setName(e.target.value);
  }

  return (
    <>
      <ListItemButton
        onClick={() => {
          handleClickOpen();
        }}
      >
        <ListItemIcon>
          <img src={RenameIcon} alt="rename-icon" />
        </ListItemIcon>
        <ListItemText primary="Rename" />
      </ListItemButton>
      <Dialog open={open} onClose={handleClose} maxWidth='xs'>
        {loading ? <LinearProgress style={{ height: 5 }} /> : <></>}
        <DialogTitle>
          <Typography variant="h3" gutterBottom component="div">Rename</Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: 250 }}>
            <TextField
              autoFocus
              defaultValue={props.name.replace(props.extension, '')}
              margin="dense"
              id="name"
              label="Name"
              error={error}
              helperText={error}
              disabled={loading}
              onChange={handelOnChange}
              type="email"
              variant="filled"
              fullWidth
            />
          </Box>

        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={handleClose}>Cancel</Button>
          <Button onClick={updateName} disabled={loading} variant='contained' style={{ color: 'white' }} size="small">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default RenameObject;