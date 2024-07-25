import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {jwtDecode} from 'jwt-decode';

const withRole = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    useEffect(() => {
      if (token) {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.rolename;

        if (allowedRoles.includes(userRole)) {
          setIsAuthorized(true);
        } else {
          router.push('/dashboard');
        }
      } else {
        router.push('/login');
      }
    }, [token, allowedRoles, router]);

    if (!isAuthorized) {
      return null; // Render nothing or a loading spinner while redirecting
    }

    return <WrappedComponent {...props} />;
  };
};

export default withRole;
