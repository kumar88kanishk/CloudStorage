import { useState } from 'react';

import {
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  Typography,
  OutlinedInput,
  Link,
  FormHelperText
} from '@mui/material';

import { useNavigate } from "react-router-dom"

import AnimateButton from 'ui-component/extended/AnimateButton';

import { LoadingButton } from '@mui/lab';

import { useSnackbar } from 'notistack';
import { SET_CURRRENT_USER } from 'store/types/user.types';
import PhoneAndroid from '@mui/icons-material/PhoneAndroid';
import network from 'helpers/network.helper';
import { authenticate } from 'constants/api.constants';
import { useDispatch } from 'react-redux';
import storageHelper from 'helpers/storage.helper';


const MobileCapture = (props) => {

  const [mobile, setMobile] = useState();

  const [error, setError] = useState();

  const { enqueueSnackbar } = useSnackbar();

  const sendOTP = async (e) => {
    e.preventDefault();
    var format = /^[6-9]\d{9}$/;
    if (mobile && mobile.length === 10 && format.test(mobile)) {
      props.setLoading(true);
      network.post(authenticate.sendOTP, { mobile, })
        .then((e) => {
          enqueueSnackbar('OTP Sent', { variant: 'success' });
          props.setLoading(false);
          props.setMobile(mobile);
        }).catch((err) => {
          if (err.response && err.response.status === 400) {
            if (err.response.data && err.response.data.info) {
              props.setLoading(false);
              return enqueueSnackbar(err.response.data.info, { variant: 'error' });
            }
          } else {
            enqueueSnackbar('Something went wrong!', { variant: 'error' });
          }
          props.setLoading(false);
        })
    } else {
      setError("Enter valid mobile number");
    }
  }

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ ml: 2 }} >
        Enter your mobile number
      </Typography>
      <Typography variant="caption" display="block" gutterBottom sx={{ ml: 2 }} >
        We need your mobile number to send One Time Password(OTP) to verify your identity
      </Typography>
      <br />
      <form onSubmit={sendOTP}>
        <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="mobile-to-proceed">Mobile</InputLabel>
          <OutlinedInput
            id="mobile-to-proceed"
            onChange={(e) => {
              setMobile(e.target.value);
              setError();
            }}
            fullWidth
            startAdornment={<InputAdornment position="start"><PhoneAndroid /></InputAdornment>}
            label="Mobile"
          />
          {error && (
            <FormHelperText error id="mobile-number-error">
              {error}
            </FormHelperText>
          )}
        </FormControl>
        <br />
        <br />
        <center>
          <AnimateButton>
            <LoadingButton
              loading={props.loading}
              loadingPosition="end"
              onClick={sendOTP}
              disableElevation
              size="large"
              type="submit"
              variant="contained"
              sx={{
                color: 'white'
              }}
            >
              Proceed
            </LoadingButton>
          </AnimateButton>
        </center>
      </form>
    </>
  );
};



const MobileOTPVerification = (props) => {

  const mobile = props.mobile;

  const dispatch = useDispatch();

  const [otp, setOtp] = useState();

  const [error, setError] = useState();

  const navigate = useNavigate()

  const { enqueueSnackbar } = useSnackbar();

  const verifyOTP = async (e) => {
    e.preventDefault();
    
    if (otp && otp.length === 6) {
      props.setLoading(true);
      network.post(authenticate.verifyOTP, { mobile, otp })
        .then((e) => {
          props.setLoading(false);
          dispatch({ type: SET_CURRRENT_USER, user: e.data.data });
          storageHelper.setItem('currentUser', JSON.stringify(e.data.data));
          if (e.data.data.isBucketCreated === false)
            return navigate("/subscription");
          navigate("/dashboard");
        }).catch((err) => {
          if (err.response && err.response.status === 400) {
            if (err.response.data && err.response.data.info) {
              enqueueSnackbar(err.response.data.info, { variant: 'error', });
            }
          } else {
            console.log(err);
            enqueueSnackbar('Something went wrong!', { variant: 'error' });
          }
          props.setLoading(false);
        })

    } else {
      setError("Enter valid OTP");
    }
  }

  const sendOTP = async () => {
    props.setLoading(true);
    network.post(authenticate.sendOTP, { mobile, })
      .then((e) => {
        enqueueSnackbar('OTP Sent', { variant: 'success' });
        props.setLoading(false);
        props.setMobile(mobile);
      }).catch((err) => {
        if (err.response && err.response.status === 400) {
          if (err.response.data && err.response.data.info) {
            return enqueueSnackbar(err.response.data.info, { variant: 'error' });
          }
        } else {
          enqueueSnackbar('Something went wrong!', { variant: 'error' });
        }
        props.setLoading(false);
      })
  }

  const changeNumber = () => {
    props.setMobile();
  }

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ ml: 2 }} >
        OTP Sent
      </Typography>
      <Typography variant="caption" display="block" gutterBottom sx={{ ml: 2 }} >
        Please enter 6 digit otp received on your {props.mobile} mobile number <br />
        <Link href="#" onClick={changeNumber} color="primary">

        </Link>
      </Typography>
      <br />
      <form onSubmit={verifyOTP}>
        <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="mobile-to-proceed">OTP</InputLabel>
          <OutlinedInput
            id="mobile-to-proceed"
            onChange={(e) => {
              setOtp(e.target.value);
              setError();
            }}
            fullWidth
            startAdornment={<InputAdornment position="start"><PhoneAndroid /></InputAdornment>}
            label="Mobile"
          />
          {error && (
            <FormHelperText error id="otp-verify-error-messgae">
              {error}
            </FormHelperText>
          )}
        </FormControl>
        <br />
        <br />
        <center>
          <AnimateButton>
            <LoadingButton
              loading={props.loading}
              loadingPosition="end"
              onClick={verifyOTP}
              disableElevation
              size="large"
              type="submit"
              variant="contained"
              sx={{
                color: 'white'
              }}
            >
              Verify
            </LoadingButton>
          </AnimateButton>
          <br />
          <br />
          <Typography variant="caption" component="span" display="block" gutterBottom sx={{ ml: 2 }} >
            Didn't recive code?
            <Link href="#" onClick={sendOTP} color="primary" component="span">
              Request again
            </Link>
          </Typography>
        </center>

      </form>
    </>
  );
}


const RegistrationForm = (props) => {

  const [loading, setLoading] = useState(false);

  const [mobile, setMobile] = useState();

  if (loading) return (
    <>
      <center style={{ margin: 20 }}>
        <CircularProgress size={70} />
      </center>
    </>
  );

  if (!mobile) return (
    <>
      <MobileCapture loading={loading} setLoading={setLoading} setMobile={setMobile} mobile={mobile} />
    </>
  )

  return (
    <>
      <MobileOTPVerification mobile={mobile} setLoading={setLoading} setMobile={setMobile} />
    </>
  )

}

export default RegistrationForm;
