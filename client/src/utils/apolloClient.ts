import {
    ApolloClient,
    InMemoryCache,
    NormalizedCacheObject,
    gql,
    Observable,
    ApolloLink,
    from,
} from "@apollo/client"

import { createUploadLink } from "apollo-upload-client"
import { onError } from "@apollo/client/link/error"
import { URL_SERVER } from "./variables"
import { useGlobalStore } from "@/storage/globalStorage"

async function RefreshTokens(client: ApolloClient<NormalizedCacheObject>) {
    const { data } = await client.mutate({
        mutation: gql`
            mutation RefreshTokens {
                refreshTokens{
                    token
                }
            }
        `,
    })
    const newAccessToken = data?.refreshTokens.token
    return `${newAccessToken}`
}

let retryCount = 0
const maxRetry = 3


const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {
        for (const err of graphQLErrors) {
            if (err.extensions.code === "UNAUTHENTICATED" && retryCount < maxRetry) {
                retryCount++

                return new Observable((observer) => {
                    RefreshTokens(client)
                        .then((token) => {
                            console.log("token", token)
                            useGlobalStore.setState({ token });
                            operation.setContext((previousContext: any) => ({
                                headers: {
                                    ...previousContext.headers,
                                    authorization: `Bearer ${token}`,
                                },
                            }))
                            const forward$ = forward(operation)
                            forward$.subscribe(observer)
                        })
                        .catch((error) => observer.error(error))
                })
            } else if (err.extensions?.UnexpectedError) {
                return new Observable((observer) => {
                    window.dispatchEvent(new Event("UnexpectedError"));
                    observer.error(err)
                })
            } else if (err.extensions.code === "UNAUTHENTICATED") {
                return new Observable((observer) => {
                    window.dispatchEvent(new Event("UnauthenticatedError"));
                    observer.error(err)
                })
            }
        }
    }
})

const uploadLink = createUploadLink({
    uri: `${URL_SERVER}/graphql`,
    credentials: "include",
    headers: {
        "apollo-require-preflight": "true",
    },
})

const authMiddleware = new ApolloLink((operation, forward) => {
    const token = useGlobalStore.getState().token;
    operation.setContext({
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
        },
    });
    return forward(operation);
});

export const client = new ApolloClient({
    uri: `${URL_SERVER}/graphql`,
    cache: new InMemoryCache({}),
    credentials: "include",
    headers: {
        "Content-Type": "application/json",
    },
    link: from([authMiddleware, errorLink, uploadLink]),
})