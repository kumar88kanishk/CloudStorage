
import { useSelector } from 'react-redux';

import GreetingsCard from './InfoCard';

import { Grid } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import BasicDetails from './profile-form';

const ProfilePage = () => {
  const userState = useSelector((state) => state.user);
  
  return (
    <>
      <GreetingsCard {...userState.user} /><br />
      <Grid container spacing={2} >
        <Grid item md={6}>

        </Grid>
        <Grid item md={6}>
          <MainCard title="Profile">
            {/* <ProfileForm userState={userState} /> */}
            <BasicDetails userState={userState.user} />
          </MainCard><br />
        </Grid>
      </Grid>
    </>
  );
}

export default ProfilePage;
