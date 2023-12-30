import * as React from "react";
import Grid from "@mui/material/Grid";
import StorageConsumption from "utils/consumption";
import Personalvault from "utils/personal-vault";

const Vaultsetup = (props) => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8} md={8}>
          <Personalvault />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <StorageConsumption type={"Storage Consumption "} />
        </Grid>
      </Grid>
    </>
  );
};

export default Vaultsetup;