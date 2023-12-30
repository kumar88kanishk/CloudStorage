import { CircularProgress, Typography } from '@mui/material';
import { user } from 'constants/api.constants';
import network from 'helpers/network.helper';
import { useEffect, useState } from 'react';
import UsersHeader from './header';
import UserTypeTabs from './tabs';
import ErrorSvg from 'assets/svg/icon-error.svg'

const Loading = () => {
    return (
        <center>
            <CircularProgress />
        </center>
    )
}

const Error = () => {
    return (
        <>
            <center>
                <img style={{ marginBottom: "50px" }} src={ErrorSvg} alt='error' height="300" />
                <Typography variant='h5' color='error' component="div">
                    Error while featching users list
                </Typography>
            </center>

        </>
    )
}

const UserManagement = () => {

    const [users, setUsers] = useState();

    const [hasError, setError] = useState(false);

    const refreshUsers = () => {
        network.get(user.userList)
            .then((e) => {
                setUsers(e.data.data);
            }).catch((err) => {
                console.log(err);
                setError(true);
            })
    }

    useEffect(() => {
        refreshUsers();
    }, []);

    return (
        <>
            <UsersHeader />
            {hasError === true ? <Error /> : <></>}
            {hasError === false && users === undefined ? <Loading /> : <></>}
            {users != null && users.length > 0 ? <UserTypeTabs users={users} refreshUsers={refreshUsers} /> : <></>}
        </>
    )
}

export default UserManagement;