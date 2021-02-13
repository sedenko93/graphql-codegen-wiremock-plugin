import {
  WiremockBodyPattern,
  WiremockConfig,
  GraphQLOperationConfig,
  WiremockPluginConfig,
} from "./config";
import { merge } from "lodash";

export function getRequestMapping(
  config: WiremockPluginConfig,
  bodyFileName: string
): WiremockConfig {
  return merge({}, config.wiremock, {
    request: {
      bodyPatterns: getBodyPatterns(config.operation, config.wiremock),
    },
    response: {
      bodyFileName: getBodyFileName(config.request.outputPath, bodyFileName),
    },
  });
}

function getBodyFileName(outputPath: string, bodyFileName: string): string {
  return `${outputPath.split("__files")?.pop()}/${bodyFileName}`.substring(1);
}

function getBodyPatterns(
  operation: GraphQLOperationConfig,
  wiremock: WiremockConfig
): WiremockBodyPattern[] {
  const operationNameBodyPattern = {
    matchesJsonPath: {
      expression: "$.operationName",
      equalTo: `${operation.name}`,
    },
  };

  if (wiremock?.request?.bodyPatterns)
    return [...wiremock.request.bodyPatterns, operationNameBodyPattern];

  return (operation.variables
    ? [
        <WiremockBodyPattern>{
          matchesJsonPath: {
            expression: "$.variables",
            equalToJson: JSON.stringify(operation.variables),
          },
        },
      ]
    : []
  ).concat(operationNameBodyPattern);
}
