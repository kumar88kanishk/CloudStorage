import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';

const ProfileSection = () => {
    const userState = useSelector((state) => state.user);
    const navigate = useNavigate()
    return (
        <>
            <IconButton
                onClick={() => {
                    navigate("/profile");
                }}
            >
                <Avatar
                    sx={{
                        borderRadius: '50%',
                        alignContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        height: 40,
                        width: 40,
                        background: theme => theme.palette.primary.main,
                        borderColor: 'white'
                    }}
                >
                    {userState.user.firstName && userState.user.lastName  ? `${userState.user.firstName[0]}${userState.user.lastName[0]}` : null}
                </Avatar>
            </IconButton>
        </>
    );
};

export default ProfileSection;
