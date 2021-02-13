import { getOperationAST } from "graphql";
import { Types } from "@graphql-codegen/plugin-helpers";
import prettier from "prettier";

export const getDocumentByName = (
  documents: Types.DocumentFile[],
  operationName: string
): Types.DocumentFile => {
  return documents.find(
    ({ document }) => document && getOperationAST(document, operationName)
  );
};

export const prettify = (source: string): string =>
  prettier.format(source, {
    parser: "json",
  });

export const getOutputFileName = (outputPath: string): string =>
  outputPath.split("/").pop();
