import { useRoutes } from 'react-router-dom';

// routes
import AuthRoutes from './AuthRoutes';
import BareRoutes from './BareRoutes';
import config from 'config';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    return useRoutes([AuthRoutes, BareRoutes], config.basename);
}
