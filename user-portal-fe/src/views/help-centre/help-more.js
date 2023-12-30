import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import messageIcon from 'assets/images/icons/message-icon.svg'

const CustomIcon = (src) => {
  return (
    <img src={src} height="21" width="20" alt='menu-logo' />
  )
}

const CustomButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  backgroundColor: theme.palette.primary.light,
  fontWeight: 'bold',
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
  },
}));

export default function HelpMoreButton() {
  return (
    <Stack direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}>
      <CustomButton disableElevation variant="contained" startIcon={CustomIcon(messageIcon)} >
        Feel Free to Ask, We Ready to Help
      </CustomButton>
    </Stack>
  );
}
