import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import GreetingsImage from 'assets/images/icons/greetings.svg'
import { Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AnimateButton from 'ui-component/extended/AnimateButton';

const WarningItem = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  alignContent: 'center',
  background: theme.palette.primary.light,
  color: theme.palette.secondary.dark,
  height: 80,
  backgroundColor: theme.palette.primary,
}));


const GreetingCard = (props) => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6} md={8}>
          <WarningItem>
            <Grid container
              direction="row"
              justifyContent="flex-start"
              spacing={3}
              alignItems="center">
              <Grid item>
                <img src={GreetingsImage} height={60} alt='greeting-logo' />
              </Grid>
              <Grid item>
                <Typography variant="h5" gutterBottom component="div">
                  Get unlimited data storage for your files & documents.
                </Typography>
                <AnimateButton>
                  <LoadingButton
                    loadingPosition="end"
                    disableElevation
                    size="small"
                    type="submit"
                    variant="contained"
                    sx={{
                      color: 'white'
                    }}
                  >
                    Upgrade Now
                  </LoadingButton>
                </AnimateButton>
              </Grid>
            </Grid>
          </WarningItem>
        </Grid>
        <Grid item xs={6} md={4}>
          {/* <StorageConsumption /> */}

        </Grid>
      </Grid>
    </>
  )
};

export default GreetingCard;