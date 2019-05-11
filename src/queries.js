// import { gql } from "apollo-boost";
import gql from "graphql-tag";

export const GET_POSTS = gql`
  query {
    getPosts {
      _id
      # title
      image {
        url
      }
    }
    # Post @client {
    #   _id
    #   imageUrl
    # }
  }
`;
// client
// export const POST = gql`
//   query {
//     Post @client {
//       _id
//       imageUrl
//     }
//   }
// `;

// export const POST_FRAG = gql`
//   fragment post on getPosts {
//     _id
//     image {
//       url
//     }
//   }
// `;

export const GET_POST = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      _id
      image {
        url
        naturalWidth
        naturalHeight
      }
      tags
      description
      likes
      created
      createdBy
      author {
        _id
        username
        avatar
        created
      }
      commentsSize
      comments {
        _id
        body
        created
        user {
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
      # title
      description
      image {
        url
      }
      likes
    }
  }
`;

export const GET_USER_POSTS = gql`
  query($username: String!) {
    getUserPosts(username: $username) {
      _id
      # title
      image {
        url
      }
      description
      tags
      created
      createdBy
      likes
      commentsSize
    }
  }
`;

export const POSTS_BY_IDS = gql`
  query($ids: [ID]!) {
    postsByIds(ids: $ids) {
      _id
      image {
        url
      }
      description
      tags
      created
      createdBy
      likes
      commentsSize
    }
  }
`;

// User Queries
export const GET_CURRENT_USER = gql`
  # query {
  #   getCurrentUser {
  #     _id
  #     email
  #     username
  #     avatar
  #     created
  #     postsSize
  #     favoritesSize
  #     favorites {
  #       _id
  #       # title
  #       image {
  #         url
  #       }
  #       likes
  #       createdBy
  #       commentsSize
  #     }
  #   }
  # }
  query {
    getCurrentUser {
      _id
      email
      username
      avatar
      created
      postsSize
      favoritesSize
      favorites {
        _id
      }
      # collectionsSize
    }
  }
`;

export const GET_USER = gql`
  query(
    $username: String!
    $withUser: Boolean = true
    $withPosts: Boolean = true
    $withFavorites: Boolean = false
    $withComments: Boolean = false
  ) {
    getUser(username: $username) {
      ...user @include(if: $withUser)
      posts @include(if: $withPosts) {
        ...post
      }
      favorites @include(if: $withFavorites) {
        ...post
      }
    }
  }
  fragment user on User {
    _id
    username
    avatar
    created
    postsSize
    favoritesSize
  }
  fragment post on Post {
    _id
    image {
      url
      naturalWidth
      naturalHeight
    }
    description
    created
    createdBy
    likes
    commentsSize
    comments @include(if: $withComments) {
      ...comment
    }
  }
  fragment comment on Comment {
    _id
    body
    created
    user {
      ...user
    }
  }
`;

export const USER = gql`
  fragment user on User {
    __typename
    _id
    username
    avatar
    created
    favorites {
      _id
    }
    postsSize
    favoritesSize
  }
`;

export const POST = gql`
  fragment post on Post {
    __typename
    _id
    image {
      url
      naturalWidth
      naturalHeight
    }
    description
    created
    createdBy
    likes
    commentsSize
  }
`;

export const INFINITE_SCROLL_POSTS = gql`
  query($pageNum: Int!, $pageSize: Int!) {
    infiniteScrollPosts(pageNum: $pageNum, pageSize: $pageSize) {
      hasMore
      posts {
        _id
        image {
          url
          naturalWidth
          naturalHeight
        }
        tags
        description
        likes
        created
        createdBy
        author {
          _id
          username
          email
          avatar
          created
        }
      }
    }
  }
`;

// posts mutation
export const ADD_POST = gql`
  mutation(
    $image: Upload!
    $naturalWidth: Int!
    $naturalHeight: Int!
    $tags: [String]
    $description: String!
    $userId: ID!
  ) {
    addPost(
      image: $image
      naturalWidth: $naturalWidth
      naturalHeight: $naturalHeight
      tags: $tags
      description: $description
      userId: $userId
    ) {
      _id
      image {
        url
        naturalWidth
        naturalHeight
      }
      # tags
      # description
      # created
      createdBy
    }
  }
`;

export const ADD_POST_ = gql`
  mutation ADD_POST_(
    $imageUrl: String!
    $tags: [String]!
    $description: String!
    $userId: ID!
  ) {
    addPost_(
      # title: $title
      imageUrl: $imageUrl
      tags: $tags
      description: $description
      userId: $userId
    ) @client
  }
`;

export const UPDATE_USER_POST = gql`
  mutation($postId: ID!, $userId: ID!, $tags: [String], $description: String!) {
    updateUserPost(
      postId: $postId
      userId: $userId
      tags: $tags
      description: $description
    ) {
      _id
      image {
        url
      }
      tags
      description
      created
      likes
      author {
        _id
        avatar
      }
    }
  }
`;

export const DELETE_USER_POST = gql`
  mutation($postId: ID!, $username: String!) {
    deleteUserPost(postId: $postId, username: $username) {
      _id
    }
  }
`;

export const ADD_POST_COMMENT = gql`
  mutation($body: String!, $userId: ID!, $postId: ID!) {
    addPostComment(body: $body, userId: $userId, postId: $postId) {
      _id
      body
      created
      user {
        _id
        username
        avatar
      }
    }
  }
`;

export const LIKE_POST = gql`
  mutation($postId: ID!, $username: String!, $isLike: Boolean!) {
    likePost(postId: $postId, username: $username, isLike: $isLike) {
      likes
      favorites {
        _id
        image {
          url
        }
        description
        tags
        created
        createdBy
        likes
        commentsSize
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

export const POST_CREATED = gql`
  subscription {
    postCreated {
      _id
      image {
        url
        naturalWidth
        naturalHeight
      }
    }
  }
`;
