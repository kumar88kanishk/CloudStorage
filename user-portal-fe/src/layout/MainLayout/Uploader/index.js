import * as React from 'react'
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { initiateFileUpload, clearAllUploads } from 'store/actions/upload.actions'
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import ListItem from '@mui/material/ListItem';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgress, {
  circularProgressClasses,
} from '@mui/material/CircularProgress';
import { getIconFromType } from 'utils/object-icon';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const FloatingCard = styled(Card)(({ theme }) => ({
  boxShadow: 5,
  padding: 0,
  margin: 0,
  width: 300,
  maxHeight: 250,
  position: 'fixed',
  right: 30,
  bottom: 0,
  zIndex: 999,
}));

const FloatingCardTitle = styled(CardActions)(({ theme }) => ({
  padding: "10px",
  margin: 0,
  maxHeight: 200,

  background: theme.palette.secondary.light,

}));


const UploadItem = (props) => {

  return (
    <>
      <Divider />
      <ListItem
        dense
        secondaryAction={
          <Box sx={{ position: 'relative', paddingTop: "5px" }}>
            {props.status === "uploading" ? <><CircularProgress
              variant={props.progress !== 100 ? "determinate" : undefined}
              sx={{
                color: (theme) =>
                  theme.palette.grey[300],
              }}
              size={20}
              thickness={7}
              {...props}
              value={100}
            />
              <CircularProgress
                variant={props.progress !== 100 ? "determinate" : undefined}
                disableShrink
                sx={{
                  color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
                  animationDuration: '550ms',
                  position: 'absolute',
                  left: 0,
                  [`& .${circularProgressClasses.circle}`]: {
                    strokeLinecap: 'round',
                  },
                }}
                size={20}
                value={props.progress}
                thickness={7}
                {...props}
              /></> : props.status === "done" ? <CheckCircleIcon color='success' fontSize="small" /> : <InfoIcon color='error' fontSize="small" />}
          </Box>
        }
      >
        <ListItemAvatar>
          <img src={getIconFromType(props.file.type)} height="20" width="20" alt="loader-icon" />
        </ListItemAvatar>
        <ListItemText
          primary={props.file.name}
          primaryTypographyProps={{
            variant: 'subtitle2',
            style: {
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }
          }}
        />
      </ListItem>
    </>
  )
}

const UploadController = (props) => {

  const controller = useSelector((state) => state.browser);

  const uploadController = useSelector((state) => state.upload);

  const dispatch = useDispatch();

  const onDrop = React.useCallback(acceptedFiles => {
    dispatch(initiateFileUpload(acceptedFiles, controller.path));
  }, [dispatch, controller.path]);

  const {
    getRootProps,
    getInputProps,
  } = useDropzone({
    onDrop,
    noClick: true,
  });

  const [expanded, setExpanded] = React.useState(true);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      {Object.keys(uploadController.uploads).length > 0 ?
        <FloatingCard sx={{ boxShadow: 5 }}>
          <FloatingCardTitle style={{}} >
            <b>item(s)</b>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon fontSize="small" />
            </ExpandMore>
            <IconButton  >
              <CloseIcon fontSize="small" onClick={() => { dispatch(clearAllUploads()) }} />
            </IconButton>
          </FloatingCardTitle>
          <Divider />
          <Collapse in={expanded} timeout="auto" style={{ maxHeight: 200, overflow: 'scroll' }}>
            {Object.values(uploadController.uploads).map((e, i) => {
              return <UploadItem {...e} />
            })}
          </Collapse>
        </FloatingCard> : <></>}
      <section>
        <div {...getRootProps({})}>
          <input {...getInputProps()} directory="" webkitdirectory="" type="file" />
          {props.outlet}
        </div>
      </section>

    </>
  )
}

export default UploadController;