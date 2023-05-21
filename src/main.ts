import { Controller, Get, Param, Post } from './core/decorators.ts'
import { getControllerDefinition } from './core/metadata.ts'

@Controller('/api/')
class MyController {
    @Get('/users')
    getUsers() {
    }

    @Get('/users/:id')
    getUser(@Param('id') _id: string) {
    }

    @Post('/users')
    createUser(_body: Record<string, string>) {
    }
}

const definition = getControllerDefinition(MyController)
console.log(definition)
