import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Grid';
import { getIconFromType } from 'utils/object-icon';
import { fromNow, bytesToSize } from 'utils/converters';
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import config from 'config';

export default function ObjectListTableView({ rows }) {
  return (
    <TableContainer component="div">
      <Table sx={{ minWidth: 650 }} aria-label="object table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell >Last Modified</TableCell>
            <TableCell >Size</TableCell>
            <TableCell >#</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              hover={true}
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Grid container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={3}>
                  <Grid item>
                    <img src={getIconFromType(row.type)} height="30" width="30" alt="object-icon" />
                  </Grid>
                  <Grid item>
                    {row.name}
                  </Grid>
                </Grid>
              </TableCell>
              <TableCell ><b>{fromNow(row.updatedAt)}</b></TableCell>
              <TableCell > <b>{bytesToSize(row.size)}</b></TableCell>
              <TableCell >

                <IconButton onClick={() => {
                  window.open(`${config.apiEnd}/container/object/${rows.hash}`);
                }}>
                  <DownloadIcon />
                </IconButton>

              </TableCell>
              <TableCell >{row.carbs}</TableCell>
              <TableCell >{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}