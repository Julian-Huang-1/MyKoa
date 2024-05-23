const Koa = require('koa')
let app = new Koa()

function sleep() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("sleep");
            resolve()
        }, 2)
    })
}

//koa所有逻辑都要变成 promise的形式
app.use((ctx, next) => {
    console.log(1);
    next()
    console.log(2);
})
app.use(async (ctx, next) => {
    console.log(3);
    // await sleep()
    await next()
    await next()
})
app.use((ctx, next) => {
    console.log(4);
})


app.on("error", (err) => {
    console.log(err);
})


app.listen(3000, () => {
    console.log("server start 3000");
})
