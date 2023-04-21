const { defineConfig } = require('cypress')

module.exports = defineConfig({
    e2e: {
       baseUrl: 'http://20.105.119.110:32137/',
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

