import React from 'react';
import { withAuthenticationRequired } from '@authok/authok-react';
import { useApi } from '../hooks/use-api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

const PORT = process.env.NEXT_PUBLIC_API_PORT || 3001;

const Users = () => {
  const { loading, error, data: users = [], fetchUsers } = useApi(
    `http://localhost:${PORT}/users`,
    {
      audience: process.env.NEXT_PUBLIC_AUDIENCE,
      scope: 'read:users',
    }
  );

  return (
    <div>
      { error ? <Error message={error.message} /> : null }
      <div><button onClick={() => fetchUsers()}>获取用户列表</button></div>
      {
        loading? <Loading /> : <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
          </tr>
        </thead>
        <tbody>
          {users?.map(({ name, email }, i) => (
            <tr key={i}>
              <td>{name}</td>
              <td>{email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      }
  </div>
  );
};

export default withAuthenticationRequired(Users);
