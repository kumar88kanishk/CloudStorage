import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import StarRateIcon from '@mui/icons-material/StarRate';
import Typography from '@mui/material/Typography';
import { withStyles } from '@mui/styles';

const styles = theme => ({
  title: {
    color: 'inherit',
    margin: 20,
    fontWeight: 'none',
    fontSize: 18,
    alignContent: 'center'
  },
  price: {
    color: 'inherit',
    fontWeight: 'bold',
  },
  selectedDivder: {
    width: 170,
    height: 1,
    border: 'none',
    background: '-webkit-gradient(linear, 0 0, 100% 0, from(transparent), to(transparent), color-stop(50%, white));'
  },
  unSelectedDivder: {
    width: 170,
    height: 1,
    border: 'none',
    background: '-webkit-gradient(linear, 0 0, 100% 0, from(transparent), to(transparent), color-stop(50%, black));'
  },
  selectedWrapper: {
    width: 200,
    height: 250,
    borderRadius: 12,
    padding: theme.spacing(1),
    alignContent: 'center',
    color: 'white',
    cursor: 'pointer',
    backgroundColor: theme.palette.secondary.dark,
  },
  unselectedWrapper: {
    width: 200,
    height: 250,
    borderRadius: 12,
    padding: theme.spacing(1),
    cursor: 'pointer',
    alignContent: 'center',
    color: theme.palette.secondary.dark,
    backgroundColor: theme.palette.secondary.light,
  }

});

const SubscriptionCard = (props) => {
  const selected = props.selected;
  return (
    <Box className={selected ? props.classes.selectedWrapper : props.classes.unselectedWrapper}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={0}
      >
        <Grid item>
          <StarRateIcon color='red' fontSize="large" />
        </Grid>
        <Grid item>
          <Typography variant="span" component="div" mt={2} className={props.classes.title} >
            {props.title}
          </Typography>
        </Grid>
        <Grid item>
          <hr className={selected ? props.classes.selectedDivder : props.classes.unSelectedDivder} />
        </Grid>
        <Grid item>
          <center>
            <Typography variant="span" component="div" mt={1} className={props.classes.title} >
              {props.storage}
            </Typography>
          </center>
        </Grid>
        <Grid item>
          <Typography variant="h3" component="div" mt={1} className={props.classes.price} >
            {props.price}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default withStyles(styles)(SubscriptionCard)
