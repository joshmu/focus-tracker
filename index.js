const runJxa = require('run-jxa');
const moment = require('moment')
const fs = require('fs')

let config = {
    interval: 10,
    dbPath: '/db.json',
    lastSave: 0,
    resetDb: process.argv[2] === 'reset'
}

let db = config.resetDb ? {} : JSON.parse(fs.readFileSync(__dirname + config.dbPath))

const sleep = async s => new Promise(res => setTimeout(res, s * 1000))

const getFocus = async () => {
    const result = await runJxa((unicorn, horse) => {
        // This is run in the JXA engine
        let appName = Application('System Events').applicationProcesses.where({ frontmost: true }).name()[0]
        // const frontmost_app = Application(frontmost_app_name)
        if (appName === 'Brave Browser') {
            // Brave
            Application(appName).windows[0].activeTab.name()
            let url = Application(appName).windows[0].activeTab.url()
            appName = url.split('//')[1].split('/')[0]
        }
        return appName
    }, ['🦄', '🐴']);

    return result
}

const run = async () => {
    let app = await getFocus()
    db[app] ? db[app] += config.interval : db[app] = config.interval
    let duration = moment.duration().add(db[app], 's').as('minutes').toFixed(1)
    console.log(`${app}: ${duration} minutes`)

    // check when last saved
    let currentMin = +moment().format('m')
    if (currentMin !== config.lastSave) {
        console.log('db: update')
        fs.writeFileSync(__dirname + config.dbPath, JSON.stringify(db))
        config.lastSave = currentMin
    }

    // again
    await sleep(config.interval)
    await run()
}

(async () => {
    console.log('FOCUS TRACKER')
    await run()
})()
