# **Authentication NextAuth + Nest + Graphql**

## Get started SERVER - Nest:
```
cd server
```
```
yarn install
```
```Create a database and update .env using the .end.example template```
```
npx prisma generate
```
```
npx prisma migrate dev 
```
```
yarn run start:dev
```

## Get started CLIENT - NEXT:
```
cd client
```
```
yarn install
```
```Update according .env to the template .env.example```
```
npx graphql-codegen
```
>[GraphQL Code Generator provides a unified way to get TypeScript types from GraphQL](https://the-guild.dev/graphql/codegen/docs/getting-started)
```
yarn run dev
```
>The local server is running on port 3000 http://localhost:3000/


## Google Authorize
Get GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET<br>
Update .env in Client Next<br><br>
## [Add more providers](https://next-auth.js.org/)
