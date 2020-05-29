module.exports = {
    apps : [{
        name        : "focus-tracker",
        script      : "./index.js",
        watch       : false,
        instances   : 1,
        max_restarts: 10,
    }]
}
