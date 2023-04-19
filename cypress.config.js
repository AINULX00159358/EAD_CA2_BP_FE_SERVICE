const { defineConfig } = require('cypress')

module.exports = defineConfig({
    e2e: {
       setUpNodeEvents(on, config){
       },
        supportFile: false,
        logger: {
            console: {
                level: 'debug'
            }
        },
        video: false
    }
})

