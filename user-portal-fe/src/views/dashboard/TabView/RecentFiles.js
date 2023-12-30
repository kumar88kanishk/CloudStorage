import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from "react-redux";
import DataTableObjectView from './TableView';
import { fetchRecentFiles } from 'store/actions/recent.actions';
import Typography from '@mui/material/Typography';

const RedentFileLoader = () => {
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

const RecentFilesTables = () => {

  const controller = useSelector((state) => state.recent);

  const dispatch = useDispatch();

  let fileList = [];

  if(controller.content) {
    fileList = [ ...controller.content.files ];
  }

  React.useEffect(() => {
    dispatch(fetchRecentFiles());
  }, [dispatch]);

  if (fileList && fileList.length === 0) {
    return (
      <center>
        <br />
        <br />
        <Typography variant='caption'>
          No recent files found
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
        {fileList && fileList.length > 0 ? <DataTableObjectView rows={fileList} /> : <RedentFileLoader />}
      </Grid>
    </>
  )
};

export default RecentFilesTables;