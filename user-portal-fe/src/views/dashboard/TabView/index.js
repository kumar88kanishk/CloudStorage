import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import StarredFilesTable from './StarredFile';
import RecentFilesTables from './RecentFiles';

export default function DashboardTabs() {

  const [value, setValue] = React.useState('recent-files');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1', marginTop: '10px' }}>
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab label="Recent Files" value="recent-files" />
          <Tab label="Starred Files" value="starred-files" />
        </TabList>
      </Box>
      <TabPanel value="recent-files" style={{ padding: 0 }}>
        <RecentFilesTables />
      </TabPanel>
      <TabPanel value="starred-files" style={{ padding: 0 }}>
        <StarredFilesTable />
      </TabPanel>
    </TabContext>
  </Box>
  );
}