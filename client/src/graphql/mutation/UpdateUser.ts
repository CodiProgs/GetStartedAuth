import { gql } from "@apollo/client";

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $name: String
    $nickname: String
  ){
    updateUser(
      updateUserInput: {
        name: $name
        nickname: $nickname
      }
    ){
        name
        nickname 
      }
  }
`