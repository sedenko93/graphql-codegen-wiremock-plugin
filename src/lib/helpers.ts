import { DocumentNode, FragmentDefinitionNode, GraphQLSchema, Kind, OperationDefinitionNode, visit } from "graphql";
import prettier from "prettier";
import { ClientSideBaseVisitor, LoadedFragment } from "@graphql-codegen/visitor-plugin-common";

export const getDocumentByName = (
  schema: GraphQLSchema,
  documents: DocumentNode,
  operationName: string
): DocumentNode => {
  const allFragments: LoadedFragment[] = [
    ...(documents.definitions.filter(
      (d) => d.kind === Kind.FRAGMENT_DEFINITION
    ) as FragmentDefinitionNode[]).map((fragmentDef) => ({
      node: fragmentDef,
      name: fragmentDef.name.value,
      onType: fragmentDef.typeCondition.name.value,
      isExternal: false,
    })),
  ];

  const visitor = new ClientSideBaseVisitor(
    schema,
    allFragments,
    { noGraphQLTag: true, noExport: true, documentVariableSuffix: "" },
    {}
  );

  return visit(documents, { leave: visitor })
    .definitions.filter((item) => typeof item === "string")
    .map((operation) => JSON.parse(operation.match(/\{.+\}/)[0]))
    .filter((operation: DocumentNode) =>
      operation.definitions.find(
        (operation: OperationDefinitionNode) =>
          operation.name.value === operationName
      )
    ).shift();  
};

export const prettify = (source: string): string =>
  prettier.format(source, {
    parser: "json",
  });

export const getOutputFileName = (outputPath: string): string =>
  outputPath.split("/").pop();
