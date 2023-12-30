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
import { Grow } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';

import { useDispatch, useSelector } from "react-redux";

import RenameIcon from 'assets/images/icons/rename-icon.svg'
import { Typography } from '@mui/material';
import { folderRename } from 'store/actions/browser.action';
import Box from '@mui/system/Box';
import { useSnackbar } from 'notistack';

const RenameObject = (props) => {

  const controller = useSelector((state) => state.browser);

  const dispatch = useDispatch();

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
    if (name && name.length > 0 && !format.test(name)) {
      if (name === props.prefix.replaceAll("/", "")) {
        return setError('Name should be different');
      }
      setLoading(true);
      dispatch(folderRename(props.path, name + '/', controller.pathKey))
        .then((e) => {
          setLoading(false);
          enqueueSnackbar(`"${props.prefix.replaceAll("/", "")}" renamed to "${name}"`, {
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
        });

      return true;
    } else {
      setError("Enter valid name");
      return false;
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
      <Dialog open={open} onClose={handleClose} maxWidth={"xs"}>
        {loading ? <LinearProgress style={{ height: 5 }} /> : <></>}

        <DialogTitle>

          <Typography variant="h3" gutterBottom component="div">Rename</Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: 250 }}>
            <TextField
              autoFocus
              defaultValue={props.prefix.replaceAll("/", "")}
              margin="dense"
              id="name"
              label="Name"
              error={error}
              helperText={error}
              disabled={loading}
              onChange={handelOnChange}
              type="email"
              fullWidth
              variant="filled"
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