import { getOperationAST, OperationDefinitionNode } from "graphql";
import { Types } from "@graphql-codegen/plugin-helpers";
import prettier from "prettier";

export const getOperationByName = (
  documents: Types.DocumentFile[],
  operationName: string
): OperationDefinitionNode | null => {
  const document = documents.find(
    ({ document }) => document && getOperationAST(document, operationName)
  );

  if (!document || !document.document) return null;

  return getOperationAST(document.document, operationName) || null;
};

export const prettify = (source: string): string =>
  prettier.format(source, {
    parser: "json",
  });

export const getOutputFileName = (outputPath: string): string =>
  outputPath.split("/").pop();
