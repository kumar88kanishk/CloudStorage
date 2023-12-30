// assets
import DashboardIcon from 'assets/images/icons/dashboard.svg'
import PeopleIcon from 'assets/images/icons/people.svg'
import NotificationIcon from 'assets/images/icons/notification.svg'

// custom icon
const CustomIcon = (src) => {
    return (
        <img src={src} height="21" width="20" alt='menu-logo' />
    )
}

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard',
            icon: CustomIcon(DashboardIcon),
            breadcrumbs: false
        },
        {
            id: 'users',
            title: 'Users',
            type: 'item',
            url: '/users',
            icon: CustomIcon(PeopleIcon),
            breadcrumbs: false
        },
        {
            id: 'notifications',
            title: 'Notifications',
            type: 'item',
            url: '/notifications',
            icon: CustomIcon(NotificationIcon),
            breadcrumbs: false
        }
    ]
};

export default dashboard;
