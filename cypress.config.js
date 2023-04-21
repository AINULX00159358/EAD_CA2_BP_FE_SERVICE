const { defineConfig } = require('cypress')

module.exports = defineConfig({
    e2e: {
        supportFile: false,
        logger: {
            console: {
                level: 'debug'
            }
        },
        video: false
    }
})

