import { DefinitionNode, DocumentNode, getOperationAST, isExecutableDefinitionNode } from "graphql";
import { Types } from "@graphql-codegen/plugin-helpers";
import prettier from "prettier";

export const getDocumentByName = (
  documents: Types.DocumentFile[],
  operationName: string
): DocumentNode => {
  const documentFile = documents.find(
    ({ document }) => document && getOperationAST(document, operationName)
  );

  // support files with multipe queries
  return {
    kind: documentFile.document.kind,
    definitions: documentFile.document.definitions.filter(
      (definition: DefinitionNode): boolean => 
        isExecutableDefinitionNode(definition) && (definition.kind === 'FragmentDefinition' || definition.name.value === operationName)      
    )
  };
};

export const prettify = (source: string): string =>
  prettier.format(source, {
    parser: "json",
  });

export const getOutputFileName = (outputPath: string): string =>
  outputPath.split("/").pop();
