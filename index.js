const runJxa = require('run-jxa');

const sleep = async ms => new Promise(res => {
    console.log(`sleep: ${ms}ms`)
    setTimeout(res, ms)
})

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

(async () => {
    await sleep(10000)
    let focus = await getFocus()
    console.log({focus})
})()
