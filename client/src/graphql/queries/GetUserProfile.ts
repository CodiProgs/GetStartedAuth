import { gql } from "@apollo/client";

export const GET_USER_PROFILE = gql`
    query GetUserProfile (
        $idOrEmail: String!
    ){
        getUserProfile(
            idOrEmail: $idOrEmail
        ){
            id
            name
            nickname
            email
            avatar
        }
    }
`