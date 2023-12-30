import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// authentication
const Register = Loadable(lazy(() => import('views/registration')));
const Login = Loadable(lazy(() => import('views/login')));

// Subscription
const Subscription = Loadable(lazy(() => import('views/subscription')));


const BareRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/login',
            element: <Login />
        },
        {
            path: '/subscription',
            element: <Subscription />
        },
        {
            path: '/register',
            element: <Register />
        },
        {
            path: '/start',
            element: <Register />
        }
    ]
};

export default BareRoutes;
