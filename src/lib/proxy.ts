import { getClient } from './apollo';
import { DocumentNode } from "graphql";
import { WiremockStubGeneratorConfig } from './config';

export const getResponse = async (
  query: DocumentNode,
  config: WiremockStubGeneratorConfig
) => {  
  const client = await getClient(config);
  const response = await client.query({
    query,
    variables: config.operation.variables
  });

  return { data: response.data };
};
