import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';

export const getClient = (uri: string) => new ApolloClient({
  link: new HttpLink({
    uri,
    // @ts-expect-error
    fetch
  }),
  cache: new InMemoryCache(),
});
