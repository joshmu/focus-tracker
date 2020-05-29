module.exports = {
    apps : [{
        name        : "focus-tracker",
        script      : "./index.js",
        watch       : true,
        instances   : 1,
        ignore_watch: [”db.json”, ”[\/\\]\./”, “node_modules”],
        max_restarts: 10
    }]
}
