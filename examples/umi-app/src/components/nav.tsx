import classNames from 'classnames';
import { Link } from 'umi';
import { useAuthok } from '@authok/authok-react';

export default function Nav(props) {
  const {
    isAuthenticated,
    user,
    logout,
  } = useAuthok();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <span className="navbar-brand">@authok/authok-react</span>
      <div className="collapse navbar-collapse">
        <div className="navbar-nav">
        <Link to="/" className={classNames({
            'nav-item': true,
            'nav-link': true,
            'nav-link active': props.location.pathname === '/',
          })}>
          主页
        </Link>
        <Link to="/users" className={classNames({
            'nav-item': true,
            'nav-link': true,
            'nav-link active': props.location.pathname === '/users',
          })}>
          用户
        </Link>
      </div>
    </div>

    {isAuthenticated ? (
    <div>
      <span id="hello">你好, {user.name}!</span>{' '}
      <button
        className={"btn btn-outline-secondary"}
        id="logout"
        onClick={() => logout({ return_to: window.location.origin })}
      >
        退登
      </button>
    </div>
  ) : (
    <button
      className={"btn btn-outline-success"}
      id="login"
      onClick={() => {
        console.alert('跳转到登录页面');
      }}
    >
      登录
    </button>
 )}
  </nav>);
}