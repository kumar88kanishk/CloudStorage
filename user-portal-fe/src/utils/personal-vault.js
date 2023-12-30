import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Button, Typography } from '@mui/material';




const VaultCard = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    alignContent: 'center',
    background: theme.palette.primary.light,
    color: theme.palette.secondary.dark,
    height: 50,  
    backgroundColor: theme.palette.primary,
  }));

const PersonalVault = () => { 
  return (
    <VaultCard>
        <Grid container
              direction="row"
              justifyContent="space-between"
              spacing={1}
              alignItems="center">
            <Grid item display="flex" gap={1} alignItems='center' xs={8}>
                <img src='data:image/png;base64,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' height={30} alt='delete-cion' />
                <Typography variant="h4" gutterBottom component="div">
                  Personal Vault
                </Typography>
            </Grid>
              <Grid item sx={4}>
                <Button variant='contained' sx={{color:'white'}} size='small'>Set up</Button>
              </Grid>
            </Grid>
    </VaultCard>
  )
}

export default PersonalVault