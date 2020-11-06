import { wrapSchema, introspectSchema } from "@graphql-tools/wrap";
import {
  DefinitionNode,
  DocumentNode,
  ExecutableDefinitionNode,
  FieldNode,
  graphql,
  isExecutableDefinitionNode,
  print,
  SelectionNode,
} from "graphql";
import { WiremockStubGeneratorConfig } from "./config";
import fetch from "node-fetch";

const TYPENAME_FIELD: FieldNode = {
  kind: "Field",
  name: {
    kind: "Name",
    value: "__typename",
  },
};

const getExecutor = (config: WiremockStubGeneratorConfig) => {
  return async ({ document, variables }: any) => {
    const query = print(document);
    const fetchResult = await fetch(config.requestUrl, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        ...config.requestHeaders,
      },
      body: JSON.stringify({ query, variables }),
    });

    return fetchResult.json();
  };
};

export const getSchema = async (config: WiremockStubGeneratorConfig) => {
  const executor = getExecutor(config);
  const schema = wrapSchema({
    schema: await introspectSchema(executor),
    executor,
  });

  return schema;
};

export const addTypenameToNode = (
  definition: ExecutableDefinitionNode
): ExecutableDefinitionNode => {
  if (!definition.selectionSet) return definition;

  return {
    ...definition,
    selectionSet: {
      ...definition.selectionSet,
      selections: <SelectionNode[]>[
        ...definition.selectionSet.selections.map((selection: any) =>
          addTypenameToNode(selection)
        ),
        ...(definition.kind !== "OperationDefinition" ? [TYPENAME_FIELD] : []),
      ],
    },
  };
};

export const addTypenameToDocument = (document: DocumentNode) => ({
  ...document,
  definitions: [...document.definitions].map((definition: DefinitionNode) =>
    isExecutableDefinitionNode(definition)
      ? addTypenameToNode(definition)
      : definition
  ),
});

export const getResponse = async (
  query: DocumentNode,
  config: WiremockStubGeneratorConfig
) => {
  return await graphql(
    await getSchema(config),
    print(addTypenameToDocument(query)),
    null,
    null,
    config.operation.variables
  );
};
