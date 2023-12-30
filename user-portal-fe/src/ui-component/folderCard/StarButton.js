import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { updateFolder } from 'store/actions/browser.action'
import { useDispatch, useSelector } from "react-redux";
import StarredIcon from 'assets/images/icons/add-to-starred.svg'
import { useSnackbar } from 'notistack';
import { Grow } from '@mui/material';

const AddToStarred = (props) => {

  useSelector((state) => state.objects);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const updateFolderStarred = () => {
    props.handelClose();
    dispatch(updateFolder(props.path, { isStared: !props.isStared }))
      .then(() => {
        enqueueSnackbar(!props.isStared ? 'Folder added to Starred' : 'Folder removed from Starred', {
          variant: 'success', anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          TransitionComponent: Grow,
        })
      })
      .catch(() => {
        enqueueSnackbar('Something went wrong!', {
          variant: 'error', anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          TransitionComponent: Grow,
        });
      })
  }

  return (
    <ListItemButton
      onClick={updateFolderStarred}
    >
      <ListItemIcon>
        <img src={StarredIcon} alt="starred-icon" />
      </ListItemIcon>
      <ListItemText primary={(props.isStared ? "Remove from starred" : "Add to starred")} />
    </ListItemButton>
  )
}

export default AddToStarred;