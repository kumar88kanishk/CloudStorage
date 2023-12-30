import { useState } from 'react';
import { Stack, CircularProgress, Button } from '@mui/material';
import SubscriptionCard from './subscription-card';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';

export default function SubscriptionList() {

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [selectedKey, setKey] = useState(1);
  const [loading] = useState(false);

  const proceed = (key) => {
    enqueueSnackbar('You are enrolled successfully!');
    navigate("/dashboard");
  }

  if (loading) return (
    <center style={{ margin: 20 }}>
      <CircularProgress size={70} />
    </center>
  );

  const subscribe = (key) => {
    setKey(key)
  };
  const list = [
    {
      key: 1,
      title: 'Free Plan',
      storage: '100 GB Storage',
      price: 'Free'
    },
    {
      key: 2,
      title: 'Premium Plan',
      storage: 'Unlimited Storage',
      price: '$20'
    }
  ]
  return (
    <>
      <Stack
        spacing={2}
        direction="row"
      >
        {list.map((e) => {
          return (

            <div onClick={() => { subscribe(e.key) }}>
              <SubscriptionCard selected={selectedKey === e.key} {...e} />
            </div>
          )
        })}

      </Stack>
      <br />
      <center>
        <Button variant="outlined" onClick={proceed}>Proceed</Button>
      </center>
    </>


  );
}
