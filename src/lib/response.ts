import fs from "fs-extra";
import { Types } from "@graphql-codegen/plugin-helpers";
import { executeOperation } from "./apollo";
import { WiremockPluginConfig } from "./config";
import { prettify } from "./helpers";

export async function createResponseFile(
  document: Types.DocumentFile,
  config: WiremockPluginConfig,
  bodyFileName: string
): Promise<void> {  
  const response = await executeOperation(document, config);  
  
  return await fs.outputFile(
    `${config.request.outputPath.split('__files')?.shift()}/__files/${bodyFileName}`,
    prettify(JSON.stringify(response))
  );
}
