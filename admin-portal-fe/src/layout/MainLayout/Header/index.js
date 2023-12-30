import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import { Avatar, ButtonBase } from '@mui/material';
import SettingsSection from './SettingsSection';
import LogoutSections from './LogoutSection';
import DrawerIcon from 'assets/images/icons/drawerOpen.svg';

const Header = ({ handleLeftDrawerToggle }) => {
    const theme = useTheme();

    return (
        <>
            {/* logo & toggler button */}
            <Box
                sx={{
                    width: 255,
                    display: 'flex',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >

            </Box>
            {/* header search */}

            <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                <Avatar
                    
                    variant="rounded"
                    sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        transition: 'all .2s ease-in-out',
                        background: theme.palette.secondary.main,
                        width: 40,
                        height: 40,
                        color: theme.palette.secondary.dark,
                    }}
                    onClick={handleLeftDrawerToggle}
                    color="inherit"
                >
                    {/* <IconMenu2 stroke={1.5} color='white' size="1.3rem" /> */}
                    <img src={DrawerIcon} width='22' height='22' alt='imcon' />
                </Avatar>
            </ButtonBase>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ flexGrow: 1 }} />

            {/* notification & profile */}
            <ProfileSection />
            <SettingsSection />
            <NotificationSection />
            <LogoutSections />
        </>
    );
};

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func
};

export default Header;
