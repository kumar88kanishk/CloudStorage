import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProfilePage from 'views/profile';
import TrashCan from 'views/trash'
import FileSharing from 'views/sharing';
import FolderBrowser from 'views/folder';
import HelpCenter from 'views/help-centre';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

// file-browser component
const FileBrowser = Loadable(lazy(() => import('views/file-browser')));

// browser component
const Browser = Loadable(lazy(() => import('views/browser')));

// browser component
const RecentFiles = Loadable(lazy(() => import('views/recent-files')));

// ==============================|| MAIN ROUTING ||============================== //

const AuthRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: '/dashboard',
            element: <DashboardDefault />
        },
        {
            path: '/file-browser',
            element: <FileBrowser />
        },
        {
            path: '/browser',
            element: <Browser path="/" />
        },
        {
            path: '/browser/:key',
            element: <FolderBrowser />
        },
        {
            path: '/file-browser/folder/:folderHash',
            element: <FileBrowser />
        },
        {
            path: '/profile',
            element: <ProfilePage />
        },
        {
            path: '/shared-files',
            element: <FileSharing />
        },
        {
            path: '/trash',
            element: <TrashCan />
        },
        {
            path: '/help-center',
            element: <HelpCenter />
        },
        {
            path: '/recent-files',
            element: <RecentFiles />
        },
        {
            path: '/starred-files',
            element: <FileBrowser mode='starred-files' key='starred-files' />
        },

    ]
};

export default AuthRoutes;
