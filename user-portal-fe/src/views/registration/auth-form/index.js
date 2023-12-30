import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  Typography,
  OutlinedInput,
  IconButton,
  Link,
  Box,
  FormHelperText,
  Grid
} from '@mui/material';

import { Grow } from '@mui/material';

import AnimateButton from 'ui-component/extended/AnimateButton';

import Visibility from '@mui/icons-material/Visibility';

import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useNavigate } from "react-router-dom"

import { LoadingButton } from '@mui/lab';

import * as Yup from 'yup';
import { Formik } from 'formik';

import { useSnackbar } from 'notistack';
import { SET_CURRRENT_USER } from 'store/types/user.types';
import PhoneAndroid from '@mui/icons-material/PhoneAndroid';
import network from 'helpers/network.helper';
import apiConstants, { authenticate } from 'constants/api.constants';
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
          enqueueSnackbar('OTP Sent', {
            variant: 'success', anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            TransitionComponent: Grow,
          });
          props.setLoading(false);
          props.setMobile(mobile);
        }).catch((err) => {
          if (err.response && err.response.status === 400) {
            if (err.response.data && err.response.data.info) {
              props.setLoading(false);
              return enqueueSnackbar(err.response.data.info, {
                variant: 'error', anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'right',
                },
                TransitionComponent: Grow,
              });
            }
          } else {
            enqueueSnackbar('Something went wrong!', {
              variant: 'error', anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              TransitionComponent: Grow,
            });
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
          if (e.data.data.isBucketCreated === false) {
            props.setMobileVerified(true);
            return;
          }
          navigate("/dashboard");
        }).catch((err) => {
          if (err.response && err.response.status === 400) {
            if (err.response.data && err.response.data.info) {
              enqueueSnackbar(err.response.data.info, {
                variant: 'error', anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'right',
                },
                TransitionComponent: Grow,
              });
            }
          } else {
            console.log(err);
            enqueueSnackbar('Something went wrong!', {
              variant: 'error', anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              TransitionComponent: Grow,
            });
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
        enqueueSnackbar('OTP Sent', {
          variant: 'success', anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          TransitionComponent: Grow,
        });
        props.setLoading(false);
        props.setMobile(mobile);
      }).catch((err) => {
        if (err.response && err.response.status === 400) {
          if (err.response.data && err.response.data.info) {
            return enqueueSnackbar(err.response.data.info, {
              variant: 'error', anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              TransitionComponent: Grow,
            });
          }
        } else {
          enqueueSnackbar('Something went wrong!', {
            variant: 'error', anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            TransitionComponent: Grow,
          });
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
const BasicDetails = (props) => {
  const theme = useTheme();

  let navigate = useNavigate()

  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [showVerifyPassword, setShowVerifyPassword] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };


  const handelClickShowVerifyPassword = () => {
    setShowVerifyPassword(!showVerifyPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const updateProfile = async (values, { setErrors, setStatus, setSubmitting }) => {
    setSubmitting(true);
    setLoading(true);
    network.patch(apiConstants.authenticate.updateProfile, { avatar: "", ...values }).then((e) => {
      setLoading(false);
      setSubmitting(false);
      var user = storageHelper.getCurrentUser();
      user = { ...user, ...e.data };
      dispatch({ type: SET_CURRRENT_USER, user: e.data.data });
      storageHelper.setItem('currentUser', JSON.stringify(user));
      enqueueSnackbar('Basic Details updated!', {
        variant: 'success', anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        TransitionComponent: Grow,
      });
      navigate('/subscription');
    }).catch((e) => {

      setLoading(false);
      if (e.response && e.response.data) {
        setErrors({ submit: e.response.data.info.message });
        setStatus({ success: false });
        setSubmitting(false);
      }
    })
  }

  return (
    <>
      <Formik
        initialValues={{
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          firstName: Yup.string().required('First name is required'),
          lastName: Yup.string().required('Last name is required'),
          password: Yup
            .string()
            .required("Please enter your password")
            .matches(
              /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
              "Password must contain at least 8 characters, one letter and one number"
            ),
          retypepassword: Yup
            .string()
            .required("Please confirm your password")
            .oneOf([Yup.ref('password'), null], "Passwords don't match.")
        })}
        onSubmit={updateProfile}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={1}
              direction="row"
              justifyContent="space-around"
              alignItems="center">
              <Grid item xs={12} lg={6} md={12}>
                <FormControl fullWidth error={Boolean(touched.firstName && errors.firstName)} sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="fname-register">First Name</InputLabel>
                  <OutlinedInput
                    id="fname-register"
                    type="text"
                    value={values.firstName}
                    name="firstName"
                    onBlur={handleBlur}
                    disabled={loading}
                    onChange={handleChange}
                    label="First Name"
                    inputProps={{}}
                  />
                  {touched.firstName && errors.firstName && (
                    <FormHelperText error id="text-fname-register">
                      {errors.firstName}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} lg={6} md={12}>

                <FormControl fullWidth error={Boolean(touched.lastName && errors.lastName)} sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="lname-register">Last Name</InputLabel>
                  <OutlinedInput
                    id="lname-register"
                    type="text"
                    value={values.lastName}
                    name="lastName"
                    disabled={loading}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Last Name"
                    inputProps={{}}
                  />
                  {touched.lastName && errors.lastName && (
                    <FormHelperText error id="text-lname-register">
                      {errors.lastName}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>



            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="email-register">Email Address</InputLabel>
              <OutlinedInput
                id="email-register"
                type="email"
                disabled={loading}
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="text-email-register">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="password-register">Password</InputLabel>
              <OutlinedInput
                id="password-register"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                disabled={loading}
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="password-register-retype">Verify Password</InputLabel>
              <OutlinedInput
                id="password-register-retype"
                type={showVerifyPassword ? 'text' : 'password'}
                value={values.retyped}
                name="retypepassword"
                onBlur={handleBlur}
                disabled={loading}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handelClickShowVerifyPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showVerifyPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.retypepassword && errors.retypepassword && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.retypepassword}
                </FormHelperText>
              )}
            </FormControl>

            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2, color: 'white' }}>
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  <AnimateButton>
                    <LoadingButton
                      loading={loading}
                      loadingPosition="end"
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size="medium"
                      type="button"
                      variant="outlined"
                      onClick={() => {
                        navigate('/subscription');
                      }}
                    >
                      Skip
                    </LoadingButton>
                  </AnimateButton>
                </Grid>
                <Grid item>
                  <AnimateButton>
                    <LoadingButton
                      loading={loading}
                      loadingPosition="end"
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size="medium"
                      type="submit"
                      variant="contained"
                      sx={{
                        color: 'white'
                      }}
                    >
                      Next
                    </LoadingButton>
                  </AnimateButton>
                </Grid>
              </Grid>

            </Box>
          </form>
        )}
      </Formik>
    </>
  );
}



const RegistrationForm = (props) => {

  const [loading, setLoading] = useState(false);

  const [mobile, setMobile] = useState();

  const [mobileVerified, setMobileVerified] = useState(false);

  if (loading) return (
    <>
      <center style={{ margin: 20 }}>
        <CircularProgress size={70} />
      </center>
    </>
  );

  if (storageHelper.getCurrentUser()) {
    return (
      <>
        <BasicDetails setMobileVerified={setMobileVerified} mobile={mobile} setLoading={setLoading} setMobile={setMobile} />
      </>
    )
  }

  if (!mobile) return (
    <>
      <MobileCapture loading={loading} setLoading={setLoading} setMobile={setMobile} mobile={mobile} />
    </>
  )

  if (!mobileVerified) return (
    <>
      <MobileOTPVerification setMobileVerified={setMobileVerified} mobile={mobile} setLoading={setLoading} setMobile={setMobile} />
    </>
  )

  return (
    <>
      <BasicDetails setMobileVerified={setMobileVerified} mobile={mobile} setLoading={setLoading} setMobile={setMobile} />
    </>
  )

}

export default RegistrationForm;
