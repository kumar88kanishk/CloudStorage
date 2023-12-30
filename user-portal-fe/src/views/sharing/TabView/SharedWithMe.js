import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from "react-redux";
import { fetchSharedWithMe, clearBrowserState } from 'store/actions/object.actions'
import ObjectCard from 'views/file-browser/ObjectCard';

const SharedWithMeLoader = () => {
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

const FolderGrid = ({ objectList }) => {

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={3}
        xs={12}
      >
        {objectList.map((e) => {
          return <Grid item>
            <ObjectCard {...e}  mode='share' />
          </Grid>
        })}
      </Grid>
    </>
  )
};

const SharedWithMe = () => {

  const dashboardController = useSelector((state) => state.objects);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchSharedWithMe());
    return () => {
      dispatch(clearBrowserState());
    };
  }, [dispatch]);

  return (
    <>
      <br />
      {dashboardController.folderContent ? <FolderGrid objectList={dashboardController.folderContent} /> : <SharedWithMeLoader />}
    </>
  )
};

export default SharedWithMe;