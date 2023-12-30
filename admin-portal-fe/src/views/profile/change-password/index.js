import { useState } from 'react';

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

import AnimateButton from 'ui-component/extended/AnimateButton';

import Visibility from '@mui/icons-material/Visibility';

import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { LoadingButton } from '@mui/lab';


const ChangePasswordForm = ({ props, ...others }) => {

  const theme = useTheme();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showVerifyPassword, setShowVerifyPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };


  const handelClickShowVerifyPassword = () => {
    setShowVerifyPassword(!showVerifyPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const perfromLogin = async (values, { setErrors, setStatus, setSubmitting }) => {


    if (values.password === values.retypepassword) {
      setLoading(true);
      console.log(values);

    } else {
      setErrors({ submit: "Password mis-match please check password and verify password" });
    }
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


            <FormControl
              fullWidth

              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="password-register">Password</InputLabel>
              <OutlinedInput
                id="password-register"
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
                  Change Password
                </LoadingButton>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default ChangePasswordForm;
