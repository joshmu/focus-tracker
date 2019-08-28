const { exec } = require('child_process');

// 'ioreg -n IODisplayWrangler |grep -i IOPowerManagement'

module.exports = bash = async (cmd) => {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                // console.error(`exec error: ${error}`);
                reject(error)
            }
            // console.log(`stdout: ${stdout}`);
            // console.error(`stderr: ${stderr}`);
            resolve(stdout)
        });
    })
}
