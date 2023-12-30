import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import StarredIcon from 'assets/images/icons/add-to-starred.svg'
import { updateFile } from 'store/actions/browser.action';
import { useSnackbar } from 'notistack';
import { Grow } from '@mui/material';


const AddToStarred = (props) => {

  useSelector((state) => state.objects);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const updateFileStarred = () => {
    props.handelClose();
    dispatch(updateFile(props.hash, { isStared: !props.isStared }))
      .then(() => {
        enqueueSnackbar(!props.isStared ? 'File added to Starred' : 'File removed from Starred', {
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
      onClick={updateFileStarred}
    >
      <ListItemIcon>
        <img src={StarredIcon} alt="starred-icon" />
      </ListItemIcon>
      <ListItemText primary={(props.isStared ? "Remove from starred" : "Add to starred")} />
    </ListItemButton>
  )
}

export default AddToStarred;