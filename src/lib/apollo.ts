import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core";
import fetch from "node-fetch";
import { WiremockStubGeneratorConfig } from "./config";

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
    cache: new InMemoryCache(),
  });
