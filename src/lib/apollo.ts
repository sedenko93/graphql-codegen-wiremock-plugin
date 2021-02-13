import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import fetch from "node-fetch";
import { DocumentNode } from "graphql";
import { WiremockPluginConfig } from "./config";
import { getOperationAST } from "graphql";

export const getClient = (
  config: WiremockPluginConfig
): ApolloClient<NormalizedCacheObject> => {
  const cache = new InMemoryCache();
  // add variables to the cache in case @client / @export are being used in the query.
  cache.writeData({ data: { ...config?.operation?.variables } });

  return new ApolloClient({
    link: new HttpLink({
      uri: config.request.url,
      // @ts-expect-error
      fetch,
      headers: config.request.headers,
    }),
    cache,
    defaultOptions: {
      query: {
        errorPolicy: "all",
      },
      mutate: {
        errorPolicy: "all",
      },
    },
    resolvers: [],
  });
};

export const executeOperation = async (
  document: DocumentNode,
  config: WiremockPluginConfig
): Promise<{ data: any; errors: any }> => {
  const client = await getClient(config);
  const operation = getOperationAST(document, config.operation.name);

  if (operation.operation === "mutation") {
    const { data, errors } = await client.mutate({
      mutation: document,
      variables: config.operation.variables,
    });

    return { data, errors };
  }

  const { data, errors } = await client.query({
    query: document,
    variables: config.operation.variables,
    fetchPolicy: "no-cache",
  });

  return { data, errors };
};
