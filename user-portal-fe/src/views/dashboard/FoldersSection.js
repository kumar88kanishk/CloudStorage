import * as React from 'react';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from "react-redux";
import { fetchContent, clearBrowser } from 'store/actions/browser.action'
import FolderCard from 'ui-component/folderCard';

const FolderLoader = () => {
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

  console.log(objectList);

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
          if(e.isTrash) return <></>;
          return (
            <Grid item key={e.id}>
              <FolderCard {...e} path={e.key} />
            </Grid>
          )
        })}
      </Grid>
    </>
  )

};

const FolderSection = () => {

  const controller = useSelector((state) => state.browser);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchContent('/'));
    return () => {
      dispatch(clearBrowser());
    }
  }, [dispatch]);

  const emptyFolder =  (
    <center>
      <Typography>
        No folders found
      </Typography>
    </center>
  )

  if(!controller.content ) {
    return <FolderLoader />
  }

  return (
    <>
      <Typography gutterBottom color="primary" component="h3" style={{ fontSize: 18, marginTop: "15px", fontWeight: 'bold', margin: "8px" }}>
        Folders
      </Typography>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {(controller.content && controller.content.dir.length > 0) ? <FolderGrid objectList={controller.content.dir} /> : emptyFolder}
      </Grid>
    </>
  )
};

export default FolderSection;