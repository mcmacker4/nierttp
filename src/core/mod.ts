export interface ControllerDefinition {
    base: string
    endpoints: EndpointDefinition[]
}

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    OPTIONS = 'OPTIONS',
    CONNECT = 'CONNECT',
    TRACE = 'TRACE',
}

export interface EndpointDefinition {
    path: string
    method: HttpMethod
    propertyKey: string
    markedArguments: Record<number, MarkedEndpointArgument>
}

export enum MarkedEndpointArgumentType {
    Param = "Param",
    Session = "Session",
    Request = "Request",
    Response = "Response",
    Body = "Body",
}
//export enum MarkedEndpointArgumentType {
//    Param = "Param",
//    Session = "Session",
//    Request = "Request",
//    Response = "Response",
//    Body = "Body",
//}

export interface MarkedEndpointArgument {
    type: MarkedEndpointArgumentType
}

export interface ParamEndpointArgument extends MarkedEndpointArgument {
    type: MarkedEndpointArgumentType.Param
    paramName: string
}

export interface SessionEndpointArgument extends MarkedEndpointArgument {
    type: MarkedEndpointArgumentType.Session
}

export interface RequestEndpointArgument extends MarkedEndpointArgument {
    type: MarkedEndpointArgumentType.Request
}

export interface ResponseEndpointArgument extends MarkedEndpointArgument {
    type: MarkedEndpointArgumentType.Response
}

export interface BodyEndpointArgument extends MarkedEndpointArgument {
    type: MarkedEndpointArgumentType.Body
}
