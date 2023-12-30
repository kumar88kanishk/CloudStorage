// material-ui
import { styled } from '@mui/material/styles';
import Image from '../../assets/images/auth/sidebar-background.png'

// ==============================|| AUTHENTICATION 1 WRAPPER ||============================== //

const SideBarWrapper = styled('div')(({ theme }) => ({
    minHeight: '100vh',
    paddingTop: '50px',
    backgroundColor: '#5694FF',
    backgroundImage: `url(${Image})`,
    backgroundSize: 'contain'
}));

export default SideBarWrapper;
