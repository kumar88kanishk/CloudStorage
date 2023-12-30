import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import { IconButton, Box, Popover, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import config from 'config'
import {  useSelector } from 'react-redux';
import AddToStarred from './StarButton';
import RenameObject from './RenameButton';
import { getIconFromType } from 'utils/object-icon';
import { useNavigate } from 'react-router-dom';
import RemoveButton from './RemoveButton';
import ShareObject from './ShareButton';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const ObjectCard = (props) => {

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const id = open ? `details-popover-${props.id}` : undefined;

  const dateWithoutTime = new Date(props.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

  const dateWithTime = new Date(props.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour12: true, hour: '2-digit', minute: 'numeric' });

  const openFolder = (e) => {
    if (!props.type && e.detail === 2) {
      navigate(`/file-browser/folder/${props.hash}`);
    }
  };

  const userState = useSelector((state) => state.user);

  if(!props.mode && props.user !== userState.user._id) {
    return <></>;
  }

  return (
    <>

      <Card
        sx={{
          width: 170, height: 180, ':hover': {
            boxShadow: 4,
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <Item onClick={openFolder}>
            <img src={getIconFromType(props.type)} height="55" width="50" alt="object-icon" />
          </Item>
          <Item>
            <IconButton aria-label="settings" aria-describedby={id} onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
          </Item>
        </Stack>

        <CardContent sx={{ padding: 1 }} onClick={openFolder}>
          <Box component="div" sx={{ md: 1, overflow: 'hidden', fontWeight: 'bold', height: '2.6em' }}>
            {props.name}
          </Box>
          <Box sx={{ mt: 1 }} component='div'>
            {dateWithoutTime}
          </Box>
          {props.sharedWith && props.sharedWith.length > 0 ? <SupervisorAccountIcon /> : <></>}
        </CardContent>
      </Card>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        elevation={2}
      >
        <Box sx={{ width: 300, borderRadius: 3, padding: '10px' }}>
          <ListItemButton dense="true">
            <ListItemIcon>
              <img src={getIconFromType(props.type)} height="30" width="30" alt="object-icon-2" />
            </ListItemIcon>
            <ListItemText primary={props.name} secondary={dateWithTime} />
          </ListItemButton>
          <Divider />
          {props.type ? (<ListItemButton
            onClick={() => {
              window.open(`${config.apiEnd}/container/object/${props.hash}`);
            }}
          >
            <ListItemIcon>
              <DownloadIcon />
            </ListItemIcon>
            <ListItemText primary="Download" />
          </ListItemButton>) : <></>}
          <Divider />
          {!props.mode ? <>
            
            {userState.user._id !== props.user ? <></> : <><Divider /><ShareObject {...props} handelClose={handleClose} /></> }
            <Divider />
            <AddToStarred {...props} handelClose={handleClose} />
            <Divider />
            <RenameObject {...props} handelClose={handleClose} />
            <Divider />
            <RemoveButton {...props} handelClose={handleClose} />
          </> : <></>}

        </Box>
      </Popover>
    </>

  );
}

export default ObjectCard;