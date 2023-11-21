import { ApolloClient, InMemoryCache, from, ApolloLink } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

export const TOKEN_NAME = 'authToken';
const GRAPHQL = process.env.REACT_APP_GRAPHQL;
const httpLink = createUploadLink({
  uri: GRAPHQL || 'http://localhost:4001/graphql',
});

const authMiddleware = () =>
  new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    const token = localStorage.getItem(TOKEN_NAME);
    if (token) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    }

    return forward(operation);
  });

const activityMiddleware = new ApolloLink((operation, forward) => {
  // add the recent-activity custom header to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      'Apollo-Require-Preflight': 'true',
      'recent-activity': localStorage.getItem('lastOnlineTime') || null,
    },
  }));

  return forward(operation);
});

export const useAppApolloClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from([authMiddleware(), activityMiddleware, httpLink]),
  });
};
