// import { gql } from "apollo-boost";
import gql from "graphql-tag";

export const GET_POSTS = gql`
  query {
    getPosts {
      _id
      title
      imageUrl
    }
    Post @client {
      _id
      title
      imageUrl
    }
  }
`;

export const POST = gql`
  query {
    Post @client {
      _id
      title
      imageUrl
    }
  }
`;

export const POST_FRAG = gql`
  fragment post on getPosts {
    _id
    title
    imageUrl
  }
`;

export const GET_POST = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      _id
      title
      imageUrl
      tags
      description
      likes
      created
      createdBy {
        _id
        username
        avatar
      }
      messagesSize
      messages {
        _id
        messageBody
        messageDate
        messageUser {
          _id
          username
          avatar
        }
      }
    }
  }
`;

export const SEARCH_POSTS = gql`
  query($searchTerm: String!) {
    searchPosts(searchTerm: $searchTerm) {
      _id
      title
      description
      imageUrl
      likes
    }
  }
`;

export const GET_USER_POSTS = gql`
  query($userId: ID!) {
    getUserPosts(userId: $userId) {
      _id
      title
      imageUrl
      description
      tags
      created
      likes
      messagesSize
    }
  }
`;

// User Queries
export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      _id
      email
      username
      password
      avatar
      created
      favoritesSize
      favorites {
        _id
        title
        imageUrl
        likes
        messagesSize
      }
    }
  }
`;

export const INFINITE_SCROLL_POSTS = gql`
  query($pageNum: Int!, $pageSize: Int!) {
    infiniteScrollPosts(pageNum: $pageNum, pageSize: $pageSize) {
      hasMore
      posts {
        _id
        title
        imageUrl
        tags
        description
        likes
        created
        messages {
          _id
        }
        createdBy {
          _id
          username
          avatar
        }
      }
    }
  }
`;

// posts mutation
export const ADD_POST = gql`
  mutation(
    $title: String!
    $image: Upload!
    $tags: [String]!
    $description: String!
    $userId: ID!
  ) {
    addPost(
      title: $title
      image: $image
      tags: $tags
      description: $description
      userId: $userId
    ) {
      _id
      title
      imageUrl
      # tags
      # description
      # created
    }
  }
`;

export const ADD_POST_ = gql`
  mutation ADD_POST_(
    $title: String!
    $imageUrl: String!
    $tags: [String]!
    $description: String! # $userId: ID!
  ) {
    addPost_(
      title: $title
      imageUrl: $imageUrl
      tags: $tags
      description: $description
    )
      # userId: $userId
      @client
  }
`;

export const UPDATE_USER_POST = gql`
  mutation(
    $postId: ID!
    $userId: ID!
    $title: String!
    # image: Upload!
    $tags: [String]!
    $description: String!
  ) {
    updateUserPost(
      postId: $postId
      userId: $userId
      title: $title
      tags: $tags
      description: $description
    ) {
      _id
      title
      imageUrl
      tags
      description
      created
      likes
      createdBy {
        _id
        avatar
      }
    }
  }
`;

export const DELETE_USER_POST = gql`
  mutation($postId: ID!) {
    deleteUserPost(postId: $postId) {
      _id
    }
  }
`;

export const ADD_POST_MESSAGE = gql`
  mutation($messageBody: String!, $userId: ID!, $postId: ID!) {
    addPostMessage(
      messageBody: $messageBody
      userId: $userId
      postId: $postId
    ) {
      _id
      messageBody
      messageDate
      messageUser {
        _id
        username
        avatar
      }
    }
  }
`;

export const LIKE_POST = gql`
  mutation($postId: ID!, $username: String!) {
    likePost(postId: $postId, username: $username) {
      likes
      favorites {
        _id
        title
        imageUrl
        likes
        messagesSize
      }
    }
  }
`;

export const UNLIKE_POST = gql`
  mutation($postId: ID!, $username: String!) {
    unlikePost(postId: $postId, username: $username) {
      likes
      favorites {
        _id
        title
        imageUrl
        likes
        messagesSize
      }
    }
  }
`;

// User Mutation
export const SIGNIN_USER = gql`
  mutation($email: String!, $password: String!) {
    signinUser(email: $email, password: $password) {
      token
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    signupUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;

// subscriptions example
export const MSGS = gql`
  query {
    msgs {
      id
      content
    }
  }
`;

export const ADD_MSG = gql`
  mutation {
    addMsg(id: 3, content: "world")
  }
`;

export const MSG_CREATED = gql`
  subscription {
    msgCreated {
      id
      content
    }
  }
`;
