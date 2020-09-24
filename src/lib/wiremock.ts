import { WiremockStubGeneratorConfig, GraphQLOperationConfig } from "./config";
import { DefinitionNode, DocumentNode, OperationDefinitionNode } from "graphql";

const isOperationDefinition = (def: DefinitionNode) =>
  def.kind === "OperationDefinition";

export const getRequestMapping = (
  config: WiremockStubGeneratorConfig,
  document: DocumentNode
) => ({
  request: createRequestMapping(config, document),
  response: createResponseMapping(config, document),
});

export const createRequestMapping = (
  config: WiremockStubGeneratorConfig,
  document: DocumentNode
) => {
  const operation = <OperationDefinitionNode>(
    document.definitions.find(isOperationDefinition)
  );

  return {
    ...config.wiremock.request,
    bodyPatterns: getBodyPatterns(operation, config?.operation.variables),
  };
};

export const createResponseMapping = (
  config: WiremockStubGeneratorConfig,
  document: DocumentNode
) => {
  const operation = <OperationDefinitionNode>(
    document.definitions.find(isOperationDefinition)
  );
  const bodyFileName =
    config?.wiremock?.response?.bodyFileName ||
    getBodyFileName(operation, config.operation);
  return {
    ...config.wiremock.response,
    bodyFileName,
  };
};

export const getBodyFileName = (
  operation: OperationDefinitionNode,
  config: GraphQLOperationConfig
) => {
  const keyValString = operation.variableDefinitions
    ?.map(
      ({ variable }) =>
        `${variable.name.value}${
          config.variables && config.variables[variable.name.value] ? `-${config.variables[variable.name.value]}` : ""
        }`
    )
    .join("-");
  return `${config.name}${keyValString ? `-${keyValString}` : ""}.json`;
};

export const getBodyPatterns = (
  operation: OperationDefinitionNode,
  variables: { [key: string]: any }
) => {
  return operation.variableDefinitions
    ?.map(({ variable }) => {
      if (!variables || variables[variable.name.value] === undefined) {
        throw new Error(
          `Could not provide query variable ${variable.name.value}, ${variable.name.value} is not given`
        );
      }

      return {
        matchesJsonPath: `$.variables[?(@.${variable.name.value} == '${
          variables[variable.name.value]
        }')]`,
      };
    })
    .concat({
      matchesJsonPath: `$[?(@.operationName == '${operation?.name?.value}')]`,
    });
};
