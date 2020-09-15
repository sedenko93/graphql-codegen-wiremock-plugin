export interface GraphQLOperationConfig {
  name: string
  variables: KeyValueObject
}

export interface KeyValueObject {
  [key: string]: any
}

export interface ProxyConfig {
  executor: string
  schema: string
  method: string
  headers: KeyValueObject
}

export interface WiremockStubGeneratorConfig {
  proxy: ProxyConfig
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