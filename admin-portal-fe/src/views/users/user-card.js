import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Grid from '@mui/material/Grid';
import BlockUserConfirmationDialog from './block-dialog';
import Tooltip from '@mui/material/Tooltip';

const UserCard = (props) => {

    const refreshUsers = () => {
        props.refreshUsers();
    }

    return (
        <Card variant="outlined">

            <ListItem
                dense
                secondaryAction={
                    <Tooltip title={props.isVerified ? 'Verified' : 'Not verified'}>
                        <CheckCircle co color={props.isVerified === true ? 'primary' : undefined} />
                    </Tooltip>
                }
            >
                <ListItemAvatar>
                    <Avatar
                        sx={{ bgcolor: theme => theme.palette.primary.main, color: 'white' }}
                        alt={`${props.firstName} ${props.lastName}`}
                        src={props.avatar}
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={`${props.firstName ? props.firstName : '-'} ${props.lastName ? props.lastName : ''}`}
                    secondary={props.mobile}
                    secondaryTypographyProps={{ style: { color: theme => theme.palette.primary.main } }} />
            </ListItem>
            <Box sx={{ p: 2 }}>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center" >
                    <Grid item>
                        <Button disableElevation variant="contained" sx={{ color: 'white' }}>User Details</Button>
                    </Grid>
                    <Grid item>
                        <BlockUserConfirmationDialog refreshUsers={refreshUsers} user={props} />
                    </Grid>
                </Grid>
            </Box>
        </Card>
    );
}

export default UserCard;
