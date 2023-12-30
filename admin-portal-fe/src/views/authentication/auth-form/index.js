import { useState } from 'react';
import { useDispatch } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';


import * as Yup from 'yup';
import { Formik } from 'formik';
import { useNavigate } from "react-router-dom"


import AnimateButton from 'ui-component/extended/AnimateButton';

import Visibility from '@mui/icons-material/Visibility';

import VisibilityOff from '@mui/icons-material/VisibilityOff';

import netwotk from 'helpers/network.helper';

import storageHelper from 'helpers/storage.helper';

// actions
import { SET_CURRRENT_USER } from 'store/types/user.types';

import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';


const Login = ({ props, ...others }) => {

  const theme = useTheme();

  const navigate = useNavigate()

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const perfromLogin = async (values, { setErrors, setStatus, setSubmitting }) => {
    setLoading(true);
    netwotk.post('/identity/user/authenticate', values).then((e) => {
      if(e.data.data.role === 'admin') {
        dispatch({ type: SET_CURRRENT_USER, user: e.data.data });
        storageHelper.setItem('currentUser', JSON.stringify(e.data.data));
        navigate("/dashboard");
      } else {
        enqueueSnackbar('You are not authorized to access this portal');
        setLoading(false);
      }
    }).catch((e) => {
      setStatus({ success: false });
      setLoading(false);
      setErrors({ submit: "Enter valid email and password" });
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
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={perfromLogin}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>

            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>

              <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="outlined-adornment-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
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
                <FormHelperText error id="outlined-adornment-password-login">
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
              <AnimateButton>
                <LoadingButton
                  loading={loading}
                  loadingPosition="end"
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  sx={{
                    color: 'white'
                  }}
                >
                  Login
                </LoadingButton>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Login;
