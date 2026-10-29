import {useState, type ReactNode} from 'react';
import {AuthContext} from '../hooks/auth/useAuth';
import {authService} from '../services';

export function AuthProvider({children}: {children: ReactNode}) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated);
    const [userName, setUserName] = useState(() => authService.userName);

    function authenticate(userName: string) {
        authService.authenticate(userName);
        setIsAuthenticated(authService.isAuthenticated);
        setUserName(authService.userName);
    }

    function revoke() {
        authService.revoke();
        setIsAuthenticated(authService.isAuthenticated);
        setUserName(authService.userName);
    }

    return (
        <AuthContext.Provider value={{isAuthenticated, userName, authenticate, revoke}}>
            {children}
        </AuthContext.Provider>
    );
}
