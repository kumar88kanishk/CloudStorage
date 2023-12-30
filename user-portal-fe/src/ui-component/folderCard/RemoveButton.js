import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { updateFolder } from 'store/actions/browser.action';
import { useDispatch, useSelector } from "react-redux";
import TrashIcon from 'assets/images/icons/trash-icon.svg'
import { useSnackbar } from 'notistack';
import { Grow } from '@mui/material';

const RemoveButton = (props) => {

  useSelector((state) => state.objects);


  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const deleteObject = () => {
    dispatch(updateFolder(props.path, { isTrash: true })).then(() => {
      enqueueSnackbar(`"${props.prefix.replaceAll("/", "")}" moved to trash`, {
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
          if (window.confirm("Are you sure want to move folder to trash?")) {
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