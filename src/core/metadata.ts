// deno-lint-ignore-file no-explicit-any ban-types
import { Reflect } from 'reflect/mod.ts'
import {
    ControllerDefinition,
    EndpointDefinition,
    HttpMethod,
    MarkedEndpointArgument,
} from './mod.ts'

const controllerMetaKey = Symbol('controller meta')
const endpointsMetaKey = Symbol('endpoints meta')
const parametersMetaKey = Symbol('parametersMetaKey')

type EndpointsMetadata = EndpointDefinition[]
type ParametersMetadata = Record<string, Record<number, MarkedEndpointArgument>>

export function getControllerDefinition(controller: Function): ControllerDefinition {
    return Reflect.getMetadata(controllerMetaKey, controller.prototype)
}

export function defineController(target: any, base: string) {
    const definition: ControllerDefinition = {
        base,
        endpoints: getControllerEndpoints(target),
    }
    Reflect.defineMetadata(controllerMetaKey, definition, target)
}

function getControllerEndpoints(target: any): EndpointDefinition[] {
    return Reflect.getMetadata(endpointsMetaKey, target) || []
}

export function defineEndpoint(
    target: any,
    propertyKey: string,
    path: string,
    method: HttpMethod,
) {
    const endpoints: EndpointsMetadata = Reflect.getMetadata(endpointsMetaKey, target) || []
    const endpoint: EndpointDefinition = {
        path,
        method,
        propertyKey,
        markedArguments: getEndpointMarkedArguments(target, propertyKey),
    }
    endpoints.push(endpoint)
    Reflect.defineMetadata(endpointsMetaKey, endpoints, target)
}

function getEndpointMarkedArguments(
    target: any,
    propertyKey: string,
): Record<number, MarkedEndpointArgument> {
    const metadata: ParametersMetadata | undefined = Reflect.getMetadata(
        parametersMetaKey,
        target,
    )
    if (metadata == undefined) {
        return []
    }
    return metadata[propertyKey] || {}
}

export function defineMarkedParameter(
    target: any,
    propertyKey: string,
    index: number,
    meta: MarkedEndpointArgument,
) {
    const parameters: ParametersMetadata = Reflect.getMetadata(parametersMetaKey, target) || {}
    const methodParameters = parameters[propertyKey] || {}
    methodParameters[index] = meta
    parameters[propertyKey] = methodParameters
    Reflect.defineMetadata(parametersMetaKey, parameters, target)
}
