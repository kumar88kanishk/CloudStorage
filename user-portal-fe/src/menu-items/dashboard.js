// assets
import MyFilesIcon from 'assets/images/icons/my-files.svg'
import DashboardIcon from 'assets/images/icons/dashboard.svg'
import TrashIcon from 'assets/images/icons/trash-icon.svg'
import RecentFiles from 'assets/images/icons/recent-files-icon.svg'
import PeopleIcon from 'assets/images/icons/people.svg'
import HelpIcon from 'assets/images/icons/help-center.svg'

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
            id: 'browser',
            title: 'My Files',
            type: 'item',
            url: '/browser',
            icon: CustomIcon(MyFilesIcon),
            breadcrumbs: false
        },
        {
            id: 'recent-files',
            title: 'Recent Files',
            type: 'item',
            url: '/recent-files',
            icon: CustomIcon(RecentFiles),
            breadcrumbs: false
        },
        {
            id: 'shared-files',
            title: 'Shared Files',
            type: 'item',
            url: '/shared-files',
            icon: CustomIcon(PeopleIcon),
            breadcrumbs: false
        },
        {
            id: 'trash',
            title: 'Trash',
            type: 'item',
            url: '/trash',
            icon: CustomIcon(TrashIcon),
            breadcrumbs: false
        },
        {
            id: 'help-center',
            title: 'Help',
            type: 'item',
            url: '/help-center',
            icon: CustomIcon(HelpIcon),
            breadcrumbs: false
        },
    ]
};

export default dashboard;
