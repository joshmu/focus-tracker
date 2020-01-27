const runJxa = require('run-jxa');
const bash = require('./bashAwait.js')
const moment = require('moment')
const fs = require('fs')

const config = {
    interval: 10,
    dbPath: '/db.json',
    // lastSave: 0,
    resetDb: process.argv[2] === 'reset'
}

let db = config.resetDb ? {} : JSON.parse(fs.readFileSync(__dirname + config.dbPath))
// console.log(config)
// console.log(db)

const sleep = async s => new Promise(res => setTimeout(res, s * 1000))

const getFocus = async () => {
    const result = await runJxa((unicorn, horse) => {
        // This is run in the JXA engine
        let appName = Application('System Events').applicationProcesses.where({ frontmost: true }).name()[0]
        // const frontmost_app = Application(frontmost_app_name)
        if (appName === 'Brave Browser' || appName === 'Google Chrome') {
            // Brave
            Application(appName).windows[0].activeTab.name()
            let url = Application(appName).windows[0].activeTab.url()
            appName = url.split('//')[1].split('/')[0].split(/\./g)
            appName = (appName.length > 2 ? appName.slice(1) : appName).join('.')
        }
        return appName
    }, ['🦄', '🐴']);

    return result
}

const run = async () => {
    // check if comp is asleep
    let sleepTxt = await bash('ioreg -n IODisplayWrangler |grep -i IOPowerManagement')
    // console.log({sleepTxt})

    // if mac is awake
    if (sleepTxt.indexOf('"CurrentPowerState"=4') > -1) {
        let app = await getFocus()
        // app = app[0].toUpperCase() + app.slice(1)    // capitalize
        db[app] ? db[app] += config.interval : db[app] = config.interval
        let duration = moment.duration().add(db[app], 's').as('minutes').toFixed(1)
        console.log(`${app}: ${duration} minutes   (${db[app]})`)
        fs.writeFileSync(__dirname + config.dbPath, JSON.stringify(db))
    } else {
        // console.log('sleeping...')
    }

    // check when last saved
    /*
    let currentMin = +moment().format('m')
    if (currentMin !== config.lastSave) {
        console.log('db: update')
        fs.writeFileSync(__dirname + config.dbPath, JSON.stringify(db))
        config.lastSave = currentMin
    }
    */

    // sleep
    await sleep(config.interval)
    process.exit(0)
    return
    // await run()
}

(async () => {
    // console.log('FOCUS TRACKER')
    await run()
})()
