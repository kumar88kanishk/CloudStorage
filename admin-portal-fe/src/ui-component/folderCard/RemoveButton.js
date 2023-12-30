import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { moveObjectToTrash } from 'store/actions/object.actions'
import { useDispatch, useSelector } from "react-redux";
import TrashIcon from 'assets/images/icons/trash-icon.svg'


const RemoveButton = (props) => {

  useSelector((state) => state.objects);

  const dispatch = useDispatch();

  const deleteObject = () => {
    dispatch(moveObjectToTrash(props.hash, props.type));
    props.handelClose();
  }

  return (
    <>
      <ListItemButton
        onClick={deleteObject}
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