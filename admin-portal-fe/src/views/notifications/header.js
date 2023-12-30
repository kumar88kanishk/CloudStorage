import { Divider, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';


const NotificationHeader = () => {
    return (
        <>
            <Grid container spacing={2} direction="row"
                justifyContent='space-between'
                alignItems="center">
                <Grid item >
                    <Typography variant="h4" gutterBottom component="div">
                        Send Notification
                    </Typography>
                </Grid>
                <Grid item >
                    <Typography variant="h4" gutterBottom component="div">
                        User management
                    </Typography>
                </Grid>
            </Grid>
            <Divider />
        </>
    )
}

export default NotificationHeader;