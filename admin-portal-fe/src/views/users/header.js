import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import NewUserDialog from './new-user/index';

const UsersHeader = () => {
    return (
        <>
            <Grid container
                spacing={2}
                direction="row"
                justifyContent='space-between'
                alignItems="center">
                <Grid item >
                    <Typography variant="h3" component="div" gutterBottom>
                        User Management
                    </Typography>
                </Grid>
                <Grid item >
                    <NewUserDialog />
                </Grid>
            </Grid>
            <Divider />
        </>
    )
}

export default UsersHeader;