import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  IconButton,
  Box,
  FormHelperText,
  Grid,
  Typography
} from '@mui/material';

import { Grow } from '@mui/material';

import AnimateButton from 'ui-component/extended/AnimateButton';

import Visibility from '@mui/icons-material/Visibility';

import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { LoadingButton } from '@mui/lab';

import * as Yup from 'yup';
import { Formik } from 'formik';

import { useSnackbar } from 'notistack';
import { SET_CURRRENT_USER } from 'store/types/user.types';
import network from 'helpers/network.helper';
import apiConstants from 'constants/api.constants';
import { useDispatch } from 'react-redux';
import storageHelper from 'helpers/storage.helper';

const BasicDetails = ({ userState }) => {
  const theme = useTheme();

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
      user = { ...user, ...e.data.data };
      console.log(user);
      storageHelper.setItem('currentUser', JSON.stringify(user));
      dispatch({ type: SET_CURRRENT_USER, user, });
      enqueueSnackbar('Basic Details updated!', {
        variant: 'success', anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        TransitionComponent: Grow,
      });
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
        initialValues={{ submit: null, ...userState }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          firstName: Yup.string().required('First name is required'),
          lastName: Yup.string().required('Last name is required'),
          password: Yup
            .string()
            .matches(
              /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
              "Password must contain at least 8 characters, one letter and one number"
            ),
          retypepassword: Yup
            .string()
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
                  <InputLabel htmlFor="firstName">First Name</InputLabel>
                  <OutlinedInput
                    id="firstName"
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

            <Typography variant='caption'>
              Leave password field empty in case you don't want to update password
            </Typography>

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
                  size="medium"
                  type="submit"
                  variant="contained"
                  sx={{
                    color: 'white'
                  }}
                >
                  Save
                </LoadingButton>
              </AnimateButton>

            </Box>
          </form>
        )}
      </Formik>
    </>
  );
}

export default BasicDetails;
