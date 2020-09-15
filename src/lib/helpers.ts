import { Source } from 'graphql-tools';
import { getOperationAST } from 'graphql';

export const getDocumentByName = (operationName: string, documents: Source[]) => {
  return documents.find(
   ({ document }) => document && getOperationAST(document)?.name?.value === operationName
  )?.document;
}