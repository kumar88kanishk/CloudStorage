import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { updateFile } from 'store/actions/browser.action';
import { useDispatch, useSelector } from "react-redux";
import * as React from 'react';
import TrashIcon from 'assets/images/icons/trash-icon.svg'
import { useSnackbar } from 'notistack';
import { Grow } from '@mui/material';

const RemoveButton = (props) => {

  useSelector((state) => state.objects);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const deleteObject = () => {
    dispatch(updateFile(props.hash, { isTrash: true }))
      .then(() => {
        enqueueSnackbar(`"${props.name}" moved to trash`, {
          variant: 'success', anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          TransitionComponent: Grow,
        });
      }).catch((e) => {
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
    props.handelClose();
  }

  return (
    <>
      <ListItemButton
        onClick={() => {
          if (window.confirm("Are you sure want to move file to trash?")) {
            deleteObject();
          }
        }}
      >
        <ListItemIcon>
          <img src={TrashIcon} alt="trash-icon" />
        </ListItemIcon>
        <ListItemText primary="Remove" />
      </ListItemButton>

    </>

  )
}

export default RemoveButton;