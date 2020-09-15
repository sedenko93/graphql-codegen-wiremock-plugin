import { getClient } from './apollo';
import { DocumentNode } from "graphql";
import { WiremockStubGeneratorConfig } from './config';

export const getResponse = async (
  query: DocumentNode,
  config: WiremockStubGeneratorConfig
) => {
  return getClient(config.proxy.schema).query({
    query,
    variables: config.operation.variables
  });
};
