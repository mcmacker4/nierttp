// deno-lint-ignore-file ban-types no-explicit-any
import { Application, Router, HTTPMethods, RouterMiddleware, Context, RouterContext } from 'oak/mod.ts'
import { getControllerDefinition } from '../core/metadata.ts'
import { ControllerDefinition, EndpointDefinition, HttpMethod, MarkedEndpointArgument, MarkedEndpointArgumentType, ParamEndpointArgument } from "../core/mod.ts";


type ClassDef<T> = Function & { new (...args: any[]): T }

export function createOakApplication(...controllers: ClassDef<any>[]): Application {
    const app = new Application()
    for (const controller of controllers) {
        mapController(app, controller)
    }
    return app
}

function mapController(app: Application, controller: ClassDef<any>) {
    const definition = getControllerDefinition(controller)
    if (definition == null)
        return
    const router = routerFromController(definition, controller);
    app.use(router.routes())
    app.use(router.allowedMethods())
}

function routerFromController(definition: ControllerDefinition, controller: ClassDef<any>): Router {
    const instance = new controller()

    const router = new Router({ prefix: fixPath(definition?.base) })

    definition.endpoints.forEach(endpoint => {
        createOakEndpoint(router, instance, endpoint)
    })

    return router
}

function createOakEndpoint(router: Router, instance: any, endpoint: EndpointDefinition) {
    const method = translateMethod(endpoint.method)
    const middleware = createMiddleware(instance, endpoint)
    router.add(method, endpoint.propertyKey, fixPath(endpoint.path), middleware)
}

function createMiddleware(instance: any, middleware: EndpointDefinition): RouterMiddleware<string> {
    return async (ctx, _next) => {
        const args = await generateCallArguments(ctx, middleware.markedArguments)
        const prototype = Object.getPrototypeOf(instance)
        const classMethod = prototype[middleware.propertyKey]
        if (typeof classMethod === 'function') {
            const result = classMethod.apply(instance, args)
            ctx.response.body = result
        }
    }
}

async function generateCallArguments(ctx: RouterContext<string>, args: MarkedEndpointArgument[]): Promise<any[]> {
    if (args.length == 0)
        return []
    const lastArg = args[args.length - 1]
    const callArgsArray = [...new Array(lastArg.position + 1)]
    for (const arg of args) {
        callArgsArray[arg.position] = await getArgumentValue(ctx, arg)
    }
    return callArgsArray
}

async function getArgumentValue(ctx: RouterContext<string>, arg: MarkedEndpointArgument): Promise<any | undefined> {
    switch (arg.type) {
        case MarkedEndpointArgumentType.Param: {
            const paramName = (arg as ParamEndpointArgument).paramName
            return ctx.params[paramName]
        }
        case MarkedEndpointArgumentType.Session: {
            break
        }
        case MarkedEndpointArgumentType.Request: {
            return ctx.request
        }
        case MarkedEndpointArgumentType.Response: {
            return ctx.response
        }
        case MarkedEndpointArgumentType.Body: {
            return await ctx.request.body().value
        }
    }
}

function translateMethod(method: HttpMethod): HTTPMethods {
    switch (method) {
        case HttpMethod.GET:
            return 'GET'
        case HttpMethod.POST:
            return 'POST'
        case HttpMethod.PATCH:
            return 'PATCH'
        case HttpMethod.PUT:
            return 'PUT'
        case HttpMethod.DELETE:
            return 'DELETE'
        case HttpMethod.OPTIONS:
            return 'OPTIONS'
        case HttpMethod.CONNECT:
            return 'CONNECT'
        case HttpMethod.TRACE:
            return 'TRACE'
    }
}

function fixPath(path: string) {
    const trimmed = path.replace(/\/+$/g, '');
    if (!trimmed.startsWith('/'))
        return '/' + trimmed
    return trimmed
}