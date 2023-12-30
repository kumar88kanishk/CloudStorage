import { useState } from 'react';
import {
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  Typography,
  OutlinedInput,
  Link,
  FormHelperText,
  Grid,
  Box,
  IconButton,
} from '@mui/material';
import { Grow } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import * as Yup from 'yup';
import { Formik } from 'formik';
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

const validateEmail = (value) => {
  let regexEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return value.match(regexEmail)
}

const validateMobile = (value) => {
  var format = /^[6-9]\d{9}$/;
  return value && value.length === 10 && format.test(value)
}

const CaptureMobileOrEmail = (props) => {

  const navigate = useNavigate()

  const [emailorMobile, setEmailorMobile] = useState();

  const [error, setError] = useState();

  const { enqueueSnackbar } = useSnackbar();

  const proceed = async (e) => {

    e.preventDefault();
    if (emailorMobile && validateMobile(emailorMobile)) {
      if (emailorMobile && emailorMobile.length === 10) {
        props.setLoading(true);
        network.post(authenticate.sendOTP, { mobile: emailorMobile, })
          .then((e) => {
            enqueueSnackbar('OTP Sent', {
              variant: 'success', anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              TransitionComponent: Grow,
            });
            props.setLoading(false);
            props.setMobileOrEmail(emailorMobile);
          }).catch((err) => {
            console.log(err);
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
        setError("Enter valid mobile number or email");
      }
    } else {
      if (emailorMobile && validateEmail(emailorMobile)) {
        props.setLoading(true);
        setTimeout(() => {
          props.setLoading(false);
          props.setMobileOrEmail(emailorMobile);
        }, 1000);
      } else {
        setError("Enter valid mobile number or email");
      }
    }


  }

  return (
    <>

      <br />

      <form onSubmit={proceed}>
        <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="mobile-or-email">Email or phone</InputLabel>
          <OutlinedInput
            id="mobile-or-email"
            onChange={(e) => {
              setEmailorMobile(e.target.value);
              setError();
            }}
            autoFocus
            fullWidth
            label="Email or phone"
          />
          {error && (
            <FormHelperText error id="mobile-number-error">
              {error}
            </FormHelperText>
          )}
        </FormControl>
        <br />
        <br />
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >

          <Grid item>
            <AnimateButton>
              <LoadingButton
                loading={props.loading}
                loadingPosition="end"
                disableElevation
                size="large"
                type="button"
                variant="outlined"
                onClick={() => {
                  navigate("/register");
                }}
              >
                Create Account
              </LoadingButton>
            </AnimateButton>
          </Grid>
          <Grid item>
            <AnimateButton>
              <LoadingButton
                loading={props.loading}
                loadingPosition="end"
                onClick={proceed}
                disableElevation
                size="large"
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
      </form>
    </>
  );
};


const PasswordAuthentication = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const perfromLogin = async (values, { setErrors, setStatus, setSubmitting }) => {
    const auth = { email: props.mobileOrEmail, password: values.password };
    props.setLoading(true);
    network.post(authenticate.authenticate, auth).then((e) => {
      dispatch({ type: SET_CURRRENT_USER, user: e.data.data });
      storageHelper.setItem('currentUser', JSON.stringify(e.data.data));
      navigate("/dashboard");
    }).catch((err) => {
      if (err.response && err.response.status === 400) {
        if (err.response.data && err.response.data.message) {
          enqueueSnackbar(err.response.data.message, {
            variant: 'error', anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          });
          setErrors({ submit: "Enter valid email and password" });
        }
      } else {
        console.log(err);
        enqueueSnackbar('Something went wrong!', {
          variant: 'error', anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
      }
      props.setLoading(false);
    })
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          submit: null
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={perfromLogin}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
            >
              <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                autoFocus
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
                      loading={props.loading}
                      loadingPosition="end"
                      disableElevation
                      onClick={() => {
                        props.setMobileOrEmail();
                      }}
                      size="large"
                      variant="outlined"

                    >
                      Back
                    </LoadingButton>
                  </AnimateButton>
                </Grid>
                <Grid item>
                  <AnimateButton>
                    <LoadingButton
                      loading={props.loading}
                      loadingPosition="end"
                      disableElevation
                      disabled={isSubmitting}
                      size="large"
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
  )

}



const MobileOTPVerification = (props) => {

  const mobile = props.mobileOrEmail;

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
          console.log(err);
          // enqueueSnackbar('Something went wrong!', { variant: 'error' });
          if (err.response && err.response.status === 400) {
            if (err.response.data && err.response.data.message) {
              enqueueSnackbar(err.response.data.message, {
                variant: 'error', anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'right',
                },
                TransitionComponent: Grow,
              });
            }
          } else {
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
    network.post(authenticate.sendOTP, { mobile })
      .then((e) => {
        enqueueSnackbar('OTP Sent', {
          variant: 'success', anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          TransitionComponent: Grow,
        });
        props.setLoading(false);
        props.setMobileOrEmail(mobile);
      }).catch((err) => {
        console.log(err);
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

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ ml: 2 }} >
        OTP Sent
      </Typography>
      <Typography variant="caption" display="block" gutterBottom sx={{ ml: 2 }} >
        Please enter 6 digit otp received on your {props.mobile} mobile number <br />
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
        <center>
          <br />
          <br />
          <Typography variant="caption" component="span" display="block" gutterBottom sx={{ ml: 2 }} >
            Didn't recive code?
            <Link href="#" onClick={sendOTP} color="primary" component="span">
              Request again
            </Link>
          </Typography>
        </center>
        <br />
        <br />
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item>
            <AnimateButton>
              <LoadingButton
                loading={props.loading}
                loadingPosition="end"
                disableElevation
                onClick={() => {
                  props.setMobileOrEmail();
                }}
                size="large"
                variant="outlined"

              >
                Back
              </LoadingButton>
            </AnimateButton>
          </Grid>
          <Grid item>
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
          </Grid>
        </Grid>
      </form>
    </>
  );
}


const AuthenticationComponent = (props) => {

  const [loading, setLoading] = useState(false);

  const [mobileOrEmail, setMobileOrEmail] = useState();

  if (loading) return (
    <>
      <center style={{ margin: 20 }}>
        <CircularProgress size={70} />
      </center>
    </>
  );

  if (!mobileOrEmail) return (
    <>
      <CaptureMobileOrEmail loading={loading} setLoading={setLoading} setMobileOrEmail={setMobileOrEmail} mobileOrEmail={mobileOrEmail} />
    </>
  )

  return validateEmail(mobileOrEmail)
    ?
    <>
      <PasswordAuthentication loading={loading} setLoading={setLoading} setMobileOrEmail={setMobileOrEmail} mobileOrEmail={mobileOrEmail} />
    </> :
    <>
      <MobileOTPVerification loading={loading} setLoading={setLoading} setMobileOrEmail={setMobileOrEmail} mobileOrEmail={mobileOrEmail} />
    </>

}

export default AuthenticationComponent;
