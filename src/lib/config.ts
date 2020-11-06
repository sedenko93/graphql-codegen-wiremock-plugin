export interface GraphQLOperationConfig {
  name: string
  variables: KeyValueObject
}

export interface KeyValueObject {
  [key: string]: any
}

export interface WiremockStubGeneratorConfig {
  requestUrl: string
  requestHeaders: KeyValueObject
  wiremock: WiremockConfig
  operation: GraphQLOperationConfig
}

export interface WiremockConfig {
  mocksDirectory: string
  request: {
    method?: string
    urlPattern?: string
    bodyPatterns?: []
  },
  response: {
    status: number
    bodyFileName: string
    body: string
  }
}