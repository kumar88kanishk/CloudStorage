import * as React from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import FolderIcon from '@mui/icons-material/Folder';



const InteractiveList = () => {
  return (
    <Box>
      <List dense>
        <ListItem component="a" href="/subscription">
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText
            primary="Subscription"
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText
            primary="Single-line item"
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText
            primary="Single-line item"
          />
        </ListItem>
      </List>
    </Box>
  );
}
export default InteractiveList;