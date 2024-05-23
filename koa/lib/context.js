const context = {

}

function defineGetter(target, key) {
    //defineProperty get 方法等价
    context.__defineGetter__(key, function () {
        return this[target][key]
    })
}
function defineSetter(target, key) {
    //defineProperty get 方法等价
    context.__defineSetter__(key, function (value) {
        this[target][key] = value
    })
}


defineGetter('request', 'path')
defineGetter('request', 'url')
defineGetter('request', 'query')




defineGetter('response', 'body')
defineSetter('response', 'body')


module.exports = context