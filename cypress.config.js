const { defineConfig } = require('cypress')

module.exports = defineConfig({
    e2e: {
       baseUrl: 'http://4.207.193.144:32137/',
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

