// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  ButtonBase,

} from '@mui/material';

// assets
import { IconLogout } from '@tabler/icons';
import storageHelper from 'helpers/storage.helper';
import { useNavigate } from "react-router-dom"

const LogoutSections = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const doLogOut = () => {
    storageHelper.clearStorage();
    navigate("/login");
  }

  return (
    <>
      <ButtonBase sx={{ borderRadius: '12px' }} onClick={doLogOut}>
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            transition: 'all .2s ease-in-out',
            background: theme.palette.primary.light,
            color: theme.palette.secondary.dark,
          }}
          aria-haspopup="true"
          color="inherit"
        >
          <IconLogout stroke={1.5} size="1.3rem" color='black' />
        </Avatar>
      </ButtonBase>
    </>
  );
};

export default LogoutSections;
