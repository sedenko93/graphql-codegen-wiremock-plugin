import {
  Types,
  PluginFunction,
  PluginValidateFn,
} from "@graphql-codegen/plugin-helpers";
import { WiremockPluginConfig } from "./config";
import { getOperationByName, prettify, getOutputFileName } from "./helpers";
import { getRequestMapping } from "./wiremock";
import { createResponseFile } from "./response";
import { GraphQLSchema } from "graphql";

export const plugin: PluginFunction = async (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: WiremockPluginConfig,
  info: { outputFile: string }
): Promise<string> => {
  const operation = getOperationByName(documents, config.operation.name);
  const bodyFileName = getOutputFileName(info.outputFile);

  if (!operation)
    throw new Error("It seems no GraphQL operations could be found");

  const requestMapping = getRequestMapping(config, bodyFileName);
  await createResponseFile(
    operation,
    config,
    requestMapping.response.bodyFileName
  );
  return prettify(JSON.stringify(requestMapping));
};

export const validate: PluginValidateFn = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: WiremockPluginConfig
) => {
  if (!config?.request?.url || !config?.request?.outputPath) {
    throw new Error(
      `invalid configuration: the request must contain an url and outputPath`
    );
  }

  if (!config?.operation?.name) {
    throw new Error(`invalid configuration: the operation must contain a name`);
  }
};
