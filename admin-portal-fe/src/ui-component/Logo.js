// material-ui
import { Typography } from '@mui/material';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {

    return (
        <Typography sx={{ alignItems: 'center', alignContent: 'center', fontSize: 30, m: 2 }} variant="h3" gutterBottom component='div'>
            LOGO
        </Typography>
    );
};

export default Logo;
