import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from "react-redux";
import DataTableObjectView from './TableView';
import { fetchStarredFiles } from 'store/actions/starred.actions';
import { Typography } from '@mui/material';

const StarredFileLoader = () => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Grid>
        <CircularProgress />
      </Grid>
    </Grid>
  )
}

const StarredFilesTable = () => {

  const controller = useSelector((state) => state.starred);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchStarredFiles());
  }, [dispatch]);


  if (controller.content && controller.content.files.length === 0) {
    return (
      <center>
        <br />
        <br />
        <Typography variant='caption'>
          No starred files found
        </Typography>
      </center>

    )
  }

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {controller.content && controller.content.files.length > 0 ? <DataTableObjectView rows={[...controller.content.files]} /> : <StarredFileLoader />}
      </Grid>
    </>
  )
};

export default StarredFilesTable;