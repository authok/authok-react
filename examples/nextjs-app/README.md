# Next.js example

This is an example of using `@authok/authok-react` with [Next.js](https://nextjs.org/).

参照 [examples/README.md](../README.md) 来创建 Authok 应用 和 API.

Add the file `./examples/nextjs-app/.env` with the `domain` and `clientId` of the application and `audience` (your API identifier)

```dotenv
NEXT_PUBLIC_DOMAIN=your-tenant.authok.cn
NEXT_PUBLIC_CLIENT_ID=yourclientid
NEXT_PUBLIC_AUDIENCE=https://api.example.com/users
```

Run `npm run dev` to start the application at http://localhost:3000

Start the API using the instructions in [examples/users-api/README.md](../users-api/README.md)
