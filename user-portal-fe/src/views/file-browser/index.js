// material-ui
import { CircularProgress, Grid } from '@mui/material';
import { useEffect, useState, } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchObjectForFolder, fetchRecentObjects, fetchStarredObjects, clearBrowserState } from 'store/actions/object.actions'
import { useParams } from 'react-router-dom';
import ObjectCard from './ObjectCard/';
import EmptyCard from './EmptyCard';
import GreetingCard from 'views/sharing/GreetingsCard';

const CircularLoader = () => {
    return (
        <center>
            <CircularProgress />
        </center>
    )
}

const FileBrowser = ({ mode }) => {

    const objectController = useSelector((state) => state.objects);

    const userState = useSelector((state) => state.user);

    const dispatch = useDispatch();

    const { folderHash } = useParams();

    const [folderContent] = useState(objectController.folderContent);

    useEffect(() => {

        switch (mode) {
            case 'recent-files':
                dispatch(fetchRecentObjects());
                break;
            case 'starred-files':
                dispatch(fetchStarredObjects());
                break;
            default:
                dispatch(fetchObjectForFolder(folderHash || 'myfiles'));
        }

        return () => {
            dispatch(clearBrowserState());
        }
    }, [dispatch, folderContent, folderHash, mode]);

    if (!objectController.folderContent) return (<CircularLoader />)

    return (
        <>
            {objectController.folderContent.length === 0 && <EmptyCard />}
            <GreetingCard />
            <br />
            <Grid container spacing={2}>
                {objectController.folderContent.map((e) => {

                    if (e.user !== userState.user._id) {
                        return <></>;
                    }
                    return (
                        <Grid item key={e.id}>
                            <ObjectCard {...e} />
                        </Grid>
                    )
                })}
            </Grid>
        </>
    )
}

export default FileBrowser;
