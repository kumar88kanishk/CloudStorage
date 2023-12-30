import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import StorageConsumption from 'utils/consumtion';

const WarningItem = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  alignContent: 'center',
  background: theme.palette.primary.light,
  color: theme.palette.secondary.dark,
  height: 50,
  backgroundColor: theme.palette.primary,
}));



const GreetingsCard = (props) => {

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8} lg={8}>
          <WarningItem>
            <Grid container
              direction="row"
              justifyContent="flex-start"
              spacing={3}
              alignItems="center">
              <Grid item>
                <Typography variant="h5" gutterBottom component="div">
                  Hello, {props.firstName} {props.lastName}
                </Typography>
              </Grid>
            </Grid>
          </WarningItem>
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <StorageConsumption />
        </Grid>
      </Grid>
    </>
  )
};

export default GreetingsCard;