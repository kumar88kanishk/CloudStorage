import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import SharedByMe from './SharedByMe';
import SharedWithMe from './SharedWithMe';

export default function FileSharingTabView() {

  const [value, setValue] = React.useState('shared-with-me');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1', marginTop: '10px' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Share with me" value="shared-with-me" />
            <Tab label="My Shared" value="shared-by-me" />
          </TabList>
        </Box>
        <TabPanel value="shared-with-me" style={{ padding: 0 }}>
          <SharedWithMe />
        </TabPanel>
        <TabPanel value="shared-by-me" style={{ padding: 0 }}>
          <SharedByMe />
        </TabPanel>
      </TabContext>
    </Box>
  );
}