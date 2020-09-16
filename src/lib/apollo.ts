import { ApolloClient } from "apollo-client";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import fetch from "node-fetch";
import { WiremockStubGeneratorConfig } from "./config";

const introspectionQuery = async (config: WiremockStubGeneratorConfig) => {
  const request = fetch(config.proxy.schema, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      variables: {},
      query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `,
    }),
  });
  const response = await request;
  const result = await response.json();
  return result.data;
}

export const getClient = async (
  config: WiremockStubGeneratorConfig,  
) =>
  new ApolloClient({
    link: new HttpLink({
      uri: config.proxy.schema,
      // @ts-expect-error
      fetch,
      headers: config.proxyHeaders,
    }),
    cache: new InMemoryCache({
      fragmentMatcher: new IntrospectionFragmentMatcher(        
        {
          introspectionQueryResultData: await introspectionQuery(config)
        }
      ),
    }),
  });
