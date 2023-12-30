import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import { IconButton, Box, Popover, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import AddToStarred from './StarButton';
import RenameObject from './RenameButton';
import { getIconFromType } from 'utils/object-icon';
import RemoveButton from './RemoveButton';
import ShareObject from './ShareButton';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import config from 'config';
import apiConstants from 'constants/api.constants';
import storageHelper from 'helpers/storage.helper';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const ObjectCard = (props) => {

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const id = open ? `details-popover-${props.id}` : undefined;

  const dateWithoutTime = new Date(props.lastModified || props.updatedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

  const dateWithTime = new Date(props.lastModified || props.updatedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour12: true, hour: '2-digit', minute: 'numeric' });

  const openFile = (e) => {

  };

  return (
    <>

      <Card
        sx={{
          width: 170, height: 150, ':hover': {
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
          <Item onClick={openFile}>
            <img src={getIconFromType(props.type)} height="55" width="50" alt="object-icon" />
          </Item>
          <Item>
            <IconButton aria-label="settings" aria-describedby={id} onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
          </Item>
        </Stack>

        <CardContent sx={{ padding: 0.5, paddingLeft: 1, }} onClick={openFile}>
          <Box component="div" sx={{ md: 1, overflow: 'hidden', fontWeight: 'bold' }}>
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

              let user = storageHelper.getCurrentUser();
              window.open(`${config.apiEnd}${apiConstants.container.bucket.downloadFile(props.hash)}?token=${user.access.token}`)

            }}
          >
            <ListItemIcon>
              <DownloadIcon />
            </ListItemIcon>
            <ListItemText primary="Download" />
          </ListItemButton>) : <></>}
          <Divider /><ShareObject {...props} handelClose={handleClose} />
          <Divider />
          <AddToStarred {...props} handelClose={handleClose} />
          <Divider />
          {props.settings && !props.settings.rename ? <></> : <RenameObject {...props} handelClose={handleClose} />}
          <Divider />
          <RemoveButton {...props} handelClose={handleClose} />
        </Box>
      </Popover>
    </>

  );
}

export default ObjectCard;