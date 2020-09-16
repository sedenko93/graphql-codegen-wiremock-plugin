import { Types, PluginFunction, PluginValidateFn } from "@graphql-codegen/plugin-helpers";
import fs from "fs-extra";
import { WiremockStubGeneratorConfig } from "./config";
import { getDocumentByName } from "./helpers";
import { getRequestMapping } from "./wiremock";
import { getResponse } from "./proxy";

const plugin: PluginFunction<WiremockStubGeneratorConfig> = async (
  _,
  documents: Types.DocumentFile[],
  config: WiremockStubGeneratorConfig
) => {
  const document = getDocumentByName(config.operation.name, documents);

  if (!document) throw new Error('It seems no GraphQL operations could be found');

  const requestMapping = getRequestMapping(config, document);

  if (config.proxy) {
    const response = JSON.stringify(await getResponse(document, config));
    await fs.outputFile(
      `${config.wiremock.mocksDirectory}/${requestMapping.response.bodyFileName}`,
      response
    );
  }

  return JSON.stringify(requestMapping);
};

const validate: PluginValidateFn = (_, __, config: WiremockStubGeneratorConfig) => {
  if (!config.wiremock || !config.wiremock.mocksDirectory) {
    throw new Error(`invalid configuration: mocksDirectory is not specified`);
  }

  if (!config.operation || !config.operation.name) {
    throw new Error(`invalid configuration: no operation is specified`);
  }

  if (!config.proxy || !config.proxy.schema) {
    console.trace(`configuration warning: could not generate response as no proxy configuration is given.`);
  }
}

export { plugin, validate };
