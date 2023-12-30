
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import sidebarimage from 'assets/images/auth/sidebar.png'

import LogoSection from 'constants/logo';
import AuthCardWrapper from 'views/registration/AuthCardWrapper';
import SideBarWrapper from 'views/registration/SideBarWrapper';
import SubscriptionList from './subscription-list';


const AuthWrapper1 = styled('div')(({ theme }) => ({
  minHeight: '100vh'
}))


const Subscription = () => {

  const theme = useTheme();


  return (
    <AuthWrapper1>

      <Grid container direction="row"
        justifyContent="center"
        alignItems="center" sx={{ minHeight: '100vh' }}>
        <Grid item xs={12} md={6} lg={6}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item>
                    <LogoSection />
                  </Grid>
                  <Grid item xs={12}>
                    <center>
                      <Typography
                        color={theme.palette.secondary.main}
                        gutterBottom
                        variant={'h3'}
                      >
                        Subscription
                      </Typography>
                    </center>
                  </Grid>
                  <Grid item xs={12}>
                    <SubscriptionList />
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={6} lg={6} display={{ xs: 'none', lg: 'block' }}>
          <SideBarWrapper>
            <Grid container
              direction="row"
              justifyContent="center"
              sx={{ minHeight: 'calc(100vh - 68px)' }}
              alignItems="center">
              <img src={sidebarimage} alt="side-bar" />
            </Grid>
          </SideBarWrapper>
        </Grid>
      </Grid>

    </AuthWrapper1>
  );
};

export default Subscription;