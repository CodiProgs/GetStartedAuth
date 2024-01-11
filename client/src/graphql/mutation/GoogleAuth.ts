import { gql } from "@apollo/client";

export const GOOGLE_AUTH = gql`
  mutation GoogleAuth(
    $token: String!
  ){
    googleAuth(
      token: $token
    ){
      id
      name
      nickname
      email
      avatar
      provider
      roles
      token
    }
  }
`