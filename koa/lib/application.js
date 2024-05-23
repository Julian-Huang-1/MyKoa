const http = require('http')
const context = require('./context')
const request = require('./request')
const response = require('./response')
const EventEmitter = require('events')


class Application extends EventEmitter {
    constructor() {
        super()
        this.context = Object.create(context)
        this.request = Object.create(request)
        this.response = Object.create(response)
        this.middlewares = []
    }

    use(midleware) {
        this.middlewares.push(midleware)
    }

    createContext(req, res) {
        let ctx = Object.create(this.context)
        let request = Object.create(this.request)
        let response = Object.create(this.response)

        ctx.request = request
        ctx.request.req = ctx.req = req
        ctx.response = response
        ctx.response.res = ctx.res = res
        return ctx
    }

    compose(ctx) {
        let index = -1
        const dispatch = (i) => {
            if (index == i) {
                return Promise.reject(new Error('next() called multiple times'))
            }
            index = i
            if (this.middlewares.length == i) {
                return Promise.resolve()
            }
            let middleware = this.middlewares[i]
            //next() 是 () => dispatch(i + 1)
            try {
                return Promise.resolve(middleware(ctx, () => dispatch(i + 1)))
            } catch (e) {
                return Promise.reject(e)
            }
        }
        return dispatch(0)
    }

    handleRequest = (req, res) => {

        let ctx = this.createContext(req, res)
        res.statusCode = 404


        this.compose(ctx).then(() => {
            if (ctx.body) {
                res.end(ctx.body)
            } else {
                res.end("Not Found")
            }
        }).catch((e) => {
            this.emit("error", e)
        })

    }


    listen() {
        let server = http.createServer(this.handleRequest)
        server.listen(...arguments)
    }
}

module.exports = Application