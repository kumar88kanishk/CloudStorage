import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

const ProfilePage = Loadable(lazy(() => import('views/profile/')));
const AdminDashboard = Loadable(lazy(() => import('views/dashboard/')));
const UserManagement = Loadable(lazy(() => import('views/users/')));
const AdminNotifications = Loadable(lazy(() => import('views/notifications/')));
// dashboard routing
// const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <AdminDashboard />
        },
        {
            path: '/dashboard',
            element: <AdminDashboard />
        },
        {
            path: '/users',
            element: <UserManagement />
        },
        {
            path: '/notifications',
            element: <AdminNotifications />
        },
        {
            path: '/profile',
            element: <ProfilePage />
        }
    ]
};

export default MainRoutes;
