import { executeOperation } from "./apollo";
import { OperationDefinitionNode } from "graphql";
import { WiremockPluginConfig } from "./config";
import { prettify } from "./helpers";
import fs from "fs-extra";

export async function createResponseFile(
  operation: OperationDefinitionNode,
  config: WiremockPluginConfig,
  bodyFileName: string
): Promise<void> {  
  const response = await executeOperation(operation, config);  
  
  return await fs.outputFile(
    `${config.request.outputPath.split('__files')?.shift()}/__files/${bodyFileName}`,
    prettify(JSON.stringify(response))
  );
}
