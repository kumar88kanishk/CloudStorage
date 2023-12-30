
import {
    Card,
    CardContent,
    Typography,
    Button
} from '@mui/material';

// assets
import referImage from 'assets/images/general/refer-earn.png';
import AnimateButton from 'ui-component/extended/AnimateButton';

// ==============================|| SIDEBAR MENU Card ||============================== //

const MenuCard = () => {

    return (
        <Card>
            <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle1" align='center'>
                    Refer your friend & get 10 GB Storage free
                </Typography>
                <div style={{ margin: "20px" }}>
                    <img src={referImage} height="100" width="200" alt='refer-earn-svg' />
                </div>

                <AnimateButton>
                    <Button
                        disableElevation
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        sx={{
                            color: 'white'
                        }}
                    >
                        Refer Now
                    </Button>
                </AnimateButton>
            </CardContent>
        </Card>
    );
};

export default MenuCard;
