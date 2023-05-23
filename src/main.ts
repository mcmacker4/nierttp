import { Controller, Get, Post, Patch, Param, Body } from './core/decorators.ts'
import { createOakApplication } from './rest/mod.ts'

@Controller('/api/')
class MyController {
    @Get('/users')
    getUsers() {
        return [
            "All Users!"
        ]
    }

    @Get('/users/:id')
    getUser(@Param('id') userId: string) {
        return {
            userId,
            name: "Hans"
        }
    }

    @Post('/users')
    // deno-lint-ignore no-explicit-any
    createUser(@Body() _body: any) {
        console.log("Creating user!")
        console.log(_body)
    }

    @Patch('/users/:id')
    // deno-lint-ignore no-explicit-any
    updateUser(@Param('id') id: string, @Body() body: any) {
        console.log(`Patching user ${id}`)
        console.log(body)
    }
}

const app = createOakApplication(MyController)

await app.listen({ port: 8080 })