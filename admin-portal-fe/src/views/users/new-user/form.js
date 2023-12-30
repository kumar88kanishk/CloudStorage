import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {

    FormControl,
    InputAdornment,
    InputLabel,

    OutlinedInput,
    IconButton,
    MenuItem,
    Box,
    FormHelperText,
    TextField,
    Grid
} from '@mui/material';

import Grow from '@material-ui/core/Grow';

import AnimateButton from 'ui-component/extended/AnimateButton';

import Visibility from '@mui/icons-material/Visibility';

import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { LoadingButton } from '@mui/lab';

import * as Yup from 'yup';
import { Formik } from 'formik';

import { useSnackbar } from 'notistack';
import network from 'helpers/network.helper';
import apiConstants from 'constants/api.constants';


const RegistrationForm = (props) => {
    const theme = useTheme();

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

    const createProfile = async (values, { setErrors, setStatus, setSubmitting }) => {
        setSubmitting(true);
        setLoading(true);
        network.post(apiConstants.user.createUser, { avatar: "", ...values }).then((e) => {
            setLoading(false);
            setSubmitting(false);
            enqueueSnackbar('New user created!', {
                variant: 'success', anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
                TransitionComponent: Grow,
            });
            props.close();
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
                    role: Yup.string().required('User role is required'),
                    mobile: Yup.string().required('Mobile number is required').matches(/^[1-9]{1}[0-9]{9}$/, "Enter a valid mobile number"),
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
                onSubmit={createProfile}
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
                        <FormControl fullWidth error={Boolean(touched.mobile && errors.mobile)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="mobile-register">Mobile Number</InputLabel>
                            <OutlinedInput
                                id="mobile-register"
                                type="text"
                                disabled={loading}
                                value={values.mobile}
                                name="mobile"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Mobile Number"
                                inputProps={{}}
                            />
                            {touched.mobile && errors.mobile && (
                                <FormHelperText error id="text-mobile-register">
                                    {errors.mobile}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <FormControl fullWidth error={Boolean(touched.mobile && errors.mobile)} sx={{ mt: 0.5 }}>
                            <InputLabel htmlFor="role-register"></InputLabel>
                            <TextField
                                id="role-register"
                                type="text"
                                disabled={loading}
                                select
                                value={values.role}
                                name="role"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="User role"
                                inputProps={{}}
                            >
                                <MenuItem key='admin' value='admin'>
                                    Admin
                                </MenuItem>
                                <MenuItem key='user' value='user'>
                                    User
                                </MenuItem>
                            </TextField>
                            {touched.role && errors.role && (
                                <FormHelperText error id="text-role-register">
                                    {errors.role}
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

export default RegistrationForm;