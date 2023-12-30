import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NoFileUploaded from 'assets/images/icons/no_file_uploaded.svg'
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import GreetingCard from "ui-component/GreetingCard";
import FileCard from "ui-component/fileCard";
import FolderCard from "ui-component/folderCard";
import { fetchRecentFiles } from "store/actions/recent.actions";

const EmptyCard = () => {

  return (
    <>
      <center style={{ top: "30%", left: "40%", position: 'fixed' }}>
        <img src={NoFileUploaded} height="350" alt="no-file-upload" /><br />
        No files are uploaded, please start uploading files
      </center>
    </>
  )
}

const Loader = () => {

  return (
    <>
      <center style={{ top: "50%", left: "50%", position: 'fixed' }}>
        <CircularProgress />
      </center>

    </>
  )
}

const RecentFiles = ({ path }) => {

  const controller = useSelector((state) => state.recent);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRecentFiles());
  }, [dispatch, path]);

  if (!controller.content) {
    return <Loader />
  }

  if (controller.content.dir.length === 0 && controller.content.files.length === 0) {
    return <EmptyCard />;
  }

  return (
    <>
      <GreetingCard />
      <br />
      <Grid container spacing={2}>

        {controller.content.dir.map((e) => {
          if (e.isTrash) return <></>;
          return (
            <Grid item key={e.id}>
              <FolderCard {...e} path={e.key} settings={{ rename: false }} />
            </Grid>
          )
        })}

        {controller.content.files.map((e) => {
          if (e.isTrash) return <></>;
          return (
            <Grid item key={e.prefix}>
              <FileCard {...e} settings={{ rename: false }} />
            </Grid>
          )
        })}

      </Grid>
    </>
  )
}

export default RecentFiles;