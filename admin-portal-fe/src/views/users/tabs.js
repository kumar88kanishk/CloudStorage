import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import UserCard from './user-card';
import Grid from '@mui/material/Grid';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 2 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function UserTypeTabs(props) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const refreshUsers = () => {
        props.refreshUsers();
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="user-type-tabs">
                    <Tab label="Users" {...a11yProps(0)} />
                    <Tab label="Admin Users" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Grid container spacing={2}>
                    {props.users.map((e, index) => {
                        
                        if (e.role === 'user') {
                            return (
                                <Grid item lg={4} md={6} xs={12} key={e._id}>
                                    <UserCard refreshUsers={refreshUsers} index={index} {...e} />
                                </Grid>
                            )
                        }
                        return <></>;
                    })}
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Grid container spacing={2}>
                    {props.users.map((e, index) => {
                        if (e.role === 'admin') {
                            return (
                                <Grid item lg={4} md={6} xs={12}  key={e._id}>
                                    <UserCard refreshUsers={refreshUsers} index={index} {...e} />
                                </Grid>
                            )
                        }
                        return <></>;
                    })}
                </Grid>
            </TabPanel>
        </Box>
    );
}
