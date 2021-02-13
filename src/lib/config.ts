export interface GraphQLOperationConfig {
  name: string
  variables: KeyValueObject
}

export interface KeyValueObject {
  [key: string]: any
}

export interface Request {
  outputPath: string
  url: string
  headers: KeyValueObject   
}
export interface WiremockPluginConfig {  
  request: Request  
  wiremock: WiremockConfig
  operation: GraphQLOperationConfig  
}

export interface WiremockConfig {  
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

export interface WiremockBodyPattern {
  matchesJsonPath: {
    expression: string
    equalTo?: string
    equalToJson?: string
  }
}