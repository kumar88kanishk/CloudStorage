import React from 'react';
import TextField from "@material-ui/core/TextField";
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from "@material-ui/core/CircularProgress";
import network from 'helpers/network.helper';
import { getShareDetails } from 'store/actions/object.actions'
import { container } from 'constants/api.constants';

export default function UserSearchBar({ hash, value, setValue, type, shareDetails }) {
  const [open, setOpen] = React.useState(false);
  const [details, setDetails] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    getShareDetails(hash, type)
      .then((e) => {
        setDetails(true);
        setValue(e.data.data)
      }).catch((e) => {
        setDetails(true);
        setValue([]);
      });
  }, [hash, type, setValue]);

  const onChangeHandle = async value => {
    // use the changed value to make request and then use the result. Which
    const userResponse = await network.get(`${container.search}q=${value}`);
    setOptions(userResponse.data.data);
  };

  return (

    <div style={{ width: 400 }}>
      {details ?
        <Autocomplete
          id="asynchronous-demo"
          style={{ width: 400 }}
          open={open}
          defaultValue={shareDetails}
          value={value}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          onChange={(event, newValue) => {
            setValue(newValue)
          }}
          multiple
          filterOptions={(x) => x}
          options={options}
          loading={loading}
          getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          // renderOption={(props, option, state) => {
          //   console.log(state.sel);
          //   return (
          //     <ListItemButton dense>
          //       <ListItemAvatar>
          //         <Avatar>
          //           <FolderIcon />
          //         </Avatar>
          //       </ListItemAvatar>
          //       <ListItemText
          //         primary={`${option.firstName} ${option.lastName}`}
          //         secondary={`${option.email}`}
          //       />
          //     </ListItemButton>
          //   )
          // }}
          renderInput={params => (
            <TextField
              {...params}
              label="Search"
              variant="filled"
              onChange={ev => {
                if (ev.target.value !== "" || ev.target.value !== null) {
                  onChangeHandle(ev.target.value);
                }
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                )
              }}
            />
          )}
        /> : <CircularProgress />}
    </div>
  );
}