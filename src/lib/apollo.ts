import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import fetch from "node-fetch";
import { OperationDefinitionNode, print } from "graphql";
import gql from "graphql-tag";
import { WiremockPluginConfig } from "./config";

export const getClient = (config: WiremockPluginConfig): ApolloClient<NormalizedCacheObject> => {
  
  const cache = new InMemoryCache();

  try {
    cache.writeData({ data: { ...config?.operation?.variables } });
  } catch(err) {
    console.log({ err });
  }
  

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
  operation: OperationDefinitionNode,
  config: WiremockPluginConfig
): Promise<{ data: any, errors: any }> => {
  const client = await getClient(config);
  
  if (operation.operation === "mutation") {
    const { data, errors } = await client.mutate({
      mutation: gql(print(operation)),
      variables: config.operation.variables,
    });

    return { data, errors };
  }

  const { data, errors } = await client.query({
    query: gql(print(operation)),
    variables: config.operation.variables,
    fetchPolicy: "no-cache",
  });

  return { data, errors };
};
