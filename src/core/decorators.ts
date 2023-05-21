// deno-lint-ignore-file no-explicit-any ban-types
import { defineController, defineEndpoint, defineMarkedParameter } from './metadata.ts'
import {
    HttpMethod,
    MarkedEndpointArgumentType,
    ParamEndpointArgument,
    RequestEndpointArgument,
    ResponseEndpointArgument,
    SessionEndpointArgument,
} from './mod.ts'

/**
 * Decorator to define a Controller
 * @param base
 * @returns
 */
export function Controller(base: string) {
    return function (target: Function) {
        defineController(target.prototype, base)
    }
}

/**
 * Decorator to mark a method as a controller endpoint accepting GET requests
 * @param path
 * @returns
 */
export function Get(path: string) {
    return Endpoint(path, HttpMethod.GET)
}

/**
 * Decorator to mark a method as a controller endpoint accepting POST requests
 * @param path
 * @returns
 */
export function Post(path: string) {
    return Endpoint(path, HttpMethod.POST)
}

/**
 * Decorator to mark a method as a controller endpoint accepting PUT requests
 * @param path
 * @returns
 */
export function Put(path: string) {
    return Endpoint(path, HttpMethod.PUT)
}

/**
 * Decorator to mark a method as a controller endpoint accepting DELETE requests
 * @param path
 * @returns
 */
export function Delete(path: string) {
    return Endpoint(path, HttpMethod.DELETE)
}

function Endpoint(path: string, method: HttpMethod) {
    return function (
        target: any,
        propertyKey: string,
        _descriptor: PropertyDescriptor,
    ) {
        if (typeof target == 'function') {
            console.log('WARN: Controller endpoint methods cannot be static')
            return
        }
        defineEndpoint(target, propertyKey, path, method)
    }
}

export function Param(name: string) {
    return function (target: any, propertyKey: string, index: number) {
        const meta: ParamEndpointArgument = {
            type: MarkedEndpointArgumentType.Param,
            paramName: name,
        }
        defineMarkedParameter(target, propertyKey, index, meta)
    }
}

export function Session() {
    return function (target: any, propertyKey: string, index: number) {
        const meta: SessionEndpointArgument = {
            type: MarkedEndpointArgumentType.Session,
        }
        defineMarkedParameter(target, propertyKey, index, meta)
    }
}

export function Request() {
    return function (target: any, propertyKey: string, index: number) {
        const meta: RequestEndpointArgument = {
            type: MarkedEndpointArgumentType.Request,
        }
        defineMarkedParameter(target, propertyKey, index, meta)
    }
}

export function Response() {
    return function (target: any, propertyKey: string, index: number) {
        const meta: ResponseEndpointArgument = {
            type: MarkedEndpointArgumentType.Response,
        }
        defineMarkedParameter(target, propertyKey, index, meta)
    }
}
