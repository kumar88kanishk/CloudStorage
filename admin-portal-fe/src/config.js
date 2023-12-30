const config = {
    // basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
    // like '/berry-material-react/react/default'
    basename: '/',
    defaultPath: '/login',
    apiEnd: process.env.REACT_APP_API_URL,
    fontFamily: `'Poppins'`,
    borderRadius: 12
};

export default config;
