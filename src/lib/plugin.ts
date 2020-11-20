import { Types, PluginFunction, PluginValidateFn } from "@graphql-codegen/plugin-helpers";
import fs from "fs-extra";
import { WiremockStubGeneratorConfig } from "./config";
import { getDocumentByName } from "./helpers";
import { getRequestMapping } from "./wiremock";
import { getResponse } from "./operation";

const plugin: PluginFunction<WiremockStubGeneratorConfig> = async (
  _,
  documents: Types.DocumentFile[],
  config: WiremockStubGeneratorConfig
) => {
  const document = getDocumentByName(config.operation.name, documents);

  if (!document) throw new Error('It seems no GraphQL operations could be found');

  const requestMapping = getRequestMapping(config, document);

  if (config.requestUrl) {
    const response = JSON.stringify(await getResponse(document, config));
    await fs.outputFile(
      `${config.wiremock.__filesDirectory}/${requestMapping.response.bodyFileName}`,
      response
    );
  }

  return JSON.stringify(requestMapping);
};

const validate: PluginValidateFn = (_, __, config: WiremockStubGeneratorConfig) => {
  if (!config?.wiremock?.__filesDirectory) {
    throw new Error(`invalid configuration: mocksDirectory is not specified`);
  }

  if (!config?.operation?.name) {
    throw new Error(`invalid configuration: no operation is specified`);
  }

  if (!config.requestUrl) {
    console.trace(`configuration warning: could not generate response as no request configuration is given.`);
  }
}

export { plugin, validate };
