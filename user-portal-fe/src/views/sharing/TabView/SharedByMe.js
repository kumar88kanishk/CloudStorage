import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from "react-redux";
import { fetchSharedByMe, clearBrowserState } from 'store/actions/object.actions'
import ObjectCard from 'views/file-browser/ObjectCard';

const SharedByMeLoader = () => {
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
            <ObjectCard {...e} mode='share' />
          </Grid>
        })}
      </Grid>
    </>
  )
};

const SharedByMe = () => {

  const objectController = useSelector((state) => state.objects);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchSharedByMe());
    return () => {
      dispatch(clearBrowserState());
    };
  }, [dispatch]);

  return (
    <>
      <br />
      {objectController.folderContent ? <FolderGrid objectList={objectController.folderContent} /> : <SharedByMeLoader />}
    </>
  )
};

export default SharedByMe;