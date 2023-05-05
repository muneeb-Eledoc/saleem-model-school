import cookie from 'cookie'

export function checkAuthorization(req) {
    const { token } = cookie.parse(req.headers.cookie || '');
    if (token) {
        return true
    } else {
        return false
    }
    // Check if the token is valid and return a boolean value
}

export function authenticate(context) {
    const { req, res } = context;
    const isAuthorized = checkAuthorization(req);
    if (!isAuthorized) {
        res.writeHead(302, { Location: '/login' });
        res.end();
    }
}