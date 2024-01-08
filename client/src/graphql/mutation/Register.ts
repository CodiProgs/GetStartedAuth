import { gql } from "@apollo/client";

export const REGISTER = gql`
    mutation Register(
        $name: String!
        $nickname: String!
        $email: String!
        $password: String!
        $passwordConfirm: String!
    ) {
        register(
            registerInput: {
                name: $name
                nickname: $nickname
                email: $email
                password: $password
                passwordConfirm: $passwordConfirm
            }
        )
    }
`