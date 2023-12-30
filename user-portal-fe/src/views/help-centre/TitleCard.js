import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import StorageConsumption from 'utils/consumption';

const TitleWrapper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  alignContent: 'center',
  background: theme.palette.primary.light,
  color: theme.palette.secondary.dark,
  height: 60,
  backgroundColor: theme.palette.primary,
}));


const TitleCard = (props) => {
  return (
    <>
      <Grid container spacing={1} direction="row" justifyContent="center" alignItems="center">
        <Grid item xs={6} md={8}>
          <TitleWrapper>
            <Grid container
              direction="row" spacing={2} justifyContent="flex-start" alignItems="center">
              <Grid item>
                <Avatar
                  sx={{
                    borderRadius: '50%', 
                    alignContent: 'center', 
                    color: 'white',
                    fontWeight: 'bold',
                    border: 3,
                    height: 40,
                    width: 40,
                    background: theme => theme.palette.primary.main,
                    borderColor: 'white'
                  }}
                >
                  H
                </Avatar>
              </Grid>
              <Grid item>
                Help Center
              </Grid>
            </Grid>
          </TitleWrapper>
        </Grid>
        <Grid item xs={6} md={4}>
          {/* <StorageConsumption /> */}
          <StorageConsumption />

        </Grid>
      </Grid>
    </>
  )
};

export default TitleCard;