
import { useEffect, } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrash, clearTrashState, restoreFile, restoreFolder } from 'store/actions/trash.actions'
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import InfoCard from './InfoCard';
import TrashCard from './TrashCard';


const CircularLoader = () => {
  return (
    <center>
      <CircularProgress />
    </center>
  )
}

const TrashCan = () => {

  const controller = useSelector((state) => state.trash);

  const dispatch = useDispatch();

  useEffect(() => {

    dispatch(fetchTrash());

    return () => {
      dispatch(clearTrashState());
    };

  }, [dispatch]);

  const onRestoreFile = (hash) => {
    dispatch(restoreFile(hash));
  }

  const onRestoreFolder = (hash) => {
    console.log(hash);
    dispatch(restoreFolder(hash));
  }

  if (!controller.content) return (<CircularLoader />)

  if (controller.content && controller.content.length === 0) return (<>
    <InfoCard />
    <center> No files or folder found </center>
  </>)

  return (
    <>
      <InfoCard /><br />
      <Grid container spacing={2}>
        {controller.content.dir.map((e) => {
          return (
            <Grid item key={e.id}>
              <TrashCard {...e} hash={e.key} onRestoreFolder={onRestoreFolder} isFolder={true} />
            </Grid>
          )
        })}
        {controller.content.files.map((e) => {
          
          return (
            <Grid item key={e.id}>
              <TrashCard {...e} onRestoreFile={onRestoreFile} isFolder={false} />
            </Grid>
          )
        })}

      </Grid>
    </>
  )
}

export default TrashCan;
