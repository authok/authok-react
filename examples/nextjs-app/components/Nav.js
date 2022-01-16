import React from 'react';
import Link from 'next/link';
import { useAuthok } from '@authok/authok-react';
import { useRouter } from 'next/router';
import { Loading } from './Loading';

export function Nav() {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
  } = useAuthok();
  const { pathname } = useRouter();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <span className="navbar-brand">@authok/authok-react</span>
      <div className="collapse navbar-collapse">
        <div className="navbar-nav">
          <Link href="/">
            <a
              className={`nav-item nav-link${
                pathname === '/' ? ' active' : ''
              }`}
            >
              主页
            </a>
          </Link>
          <Link href="/users">
            <a
              className={`nav-item nav-link${
                pathname === '/users' ? ' active' : ''
              }`}
            >
              用户
            </a>
          </Link>
        </div>
      </div>

      {isAuthenticated ? (
        <div>
          <span id="hello">Hello, {user.name}!</span>{' '}
          <button
            className="btn btn-outline-secondary"
            id="logout"
            onClick={() => logout({ return_to: window.location.origin })}
          >
            退登
          </button>
        </div>
      ) : (
        <button
          className="btn btn-outline-success"
          id="login"
          onClick={() => loginWithRedirect()}
        >
          登录
        </button>
      )}
    </nav>
  );
}
