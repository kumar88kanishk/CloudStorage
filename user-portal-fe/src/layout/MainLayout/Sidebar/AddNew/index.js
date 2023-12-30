import React from 'react';
import { Avatar, Typography, Fab, Grid, LinearProgress, Grow } from '@mui/material';
import { IconPlus } from '@tabler/icons';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import UploadIcon from 'assets/images/icons/upload.svg'
import FolderIcon from 'assets/images/icons/new-folder.svg'
import Paper from '@mui/material/Paper';
import { initiateFileUpload } from 'store/actions/upload.actions'
import { useDispatch, useSelector } from 'react-redux';
import { folderCreate } from 'store/actions/browser.action';
import { useSnackbar } from 'notistack';

const AddNewButton = () => {

  const theme = useTheme();

  const [open, setOpen] = React.useState(false);

  const loading = false;

  const dispatch = useDispatch();

  const controller = useSelector((state) => state.browser);

  const [folder, setFolder] = React.useState(false);

  const [name, setName] = React.useState('Untitled folder');

  const [error, setError] = React.useState(null);

  const inputFile = React.useRef(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFolder(false);
  };

  const { enqueueSnackbar } = useSnackbar();

  const updateName = () => {
    if (name && name.length > 0) {
      dispatch(folderCreate(controller.pathKey, name || 'Untitled folder'))
        .then(() => {
          enqueueSnackbar(`Folder created!`, {
            variant: 'success', anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            TransitionComponent: Grow,
          });
        })
        .catch((e) => {
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
      handleClose();
    } else {
      setError("Enter valid folder name");
    }

  };

  const handelOnChange = (e) => {
    setError(null);
    setName(e.target.value);
  }

  return (
    <>

      <Fab variant="extended"
        color="white"
        component="label"
        onClick={() => {
          handleClickOpen();
        }}
        sx={{
          backgroundColor: 'inherit',
          py: 1.25,
          mt: 2,
          width: '100%'
        }} >
        <Avatar sx={{ bgcolor: theme.palette.secondary.dark, height: 30, width: 30 }} >
          <IconPlus sx={{ mr: 1 }} color='white' size={30} />
        </Avatar>
        <Typography sx={{ ml: 1 }} variant="h4" color="inherit" >
          Add New
        </Typography>
      </Fab>
      <Dialog open={open} onClose={handleClose} maxWidth={"xs"}>
        {loading ? <LinearProgress style={{ height: 5 }} /> : <></>}
        <DialogTitle>
          <Typography variant="h4" gutterBottom component="center">
            {!folder ? "Create new" : "New folder"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {folder ? <TextField
            autoFocus
            margin="dense"
            id="name"
            disabled={loading}
            error={error}
            helperText={error}
            onChange={handelOnChange}
            defaultValue="Untitled folder"
            fullWidth
            variant="filled"
          /> : <></>}
          {!folder ? <Grid
            container
            direction="row"
            spacing={4}
            justifyContent="space-around"
            alignItems="center"
          >
            <Grid item>
              <Paper onClick={() => {
                inputFile.current.click();
              }} style={{ padding: "20px" }} elevation={3} variant="outlined" aria-label="upload-photo">
                <input
                  style={{ display: "none" }}
                  ref={inputFile}
                  onChange={(e) => {
                    const { files } = e.target;
                    if (files && files.length) {
                      console.log(files);
                      dispatch(initiateFileUpload([files[0]], controller.path));
                      handleClose();
                    }
                  }}
                  type="file"
                />
                <img src={UploadIcon} alt='upload-files' height="30" />
              </Paper>
            </Grid>

            <Grid item>
              <Paper onClick={() => {
                setFolder(!folder);
              }} style={{ padding: "20px" }} elevation={3} variant="outlined" aria-label="create-folder">
                <img src={FolderIcon} alt='create-folders' height="30" />
              </Paper>
            </Grid>
          </Grid> : <></>}
        </DialogContent>
        {folder ? <DialogActions style={{ marginLeft: "32px", marginRight: "32px" }}>
          <Button disabled={loading} fullWidth onClick={updateName} variant='contained' style={{ color: 'white' }} size="small">
            Create
          </Button>
          <Button disabled={loading} fullWidth onClick={handleClose}>Cancel</Button>
        </DialogActions> : <></>}

      </Dialog>
    </>
  );
}

export default AddNewButton;