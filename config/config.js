class Config {
    // private variable on class scope
    #env = ['development', 'staging', 'production'];

    app() {
        return {
            env: this.#env[0],
            port: 3000,
            cors: {
                whitelist:[
                    'http://localhost:80',
                    'http://localhost:8080',
                    'http://localhost:3000'
                ]
            },
        }
    }

    // configuration for database call
    database(){
        return {
            username:"root",
            password:"ind0nes1aTung4l1k4@#",
            server:'localhost',
            dbMysql: 'general_db_id',
            portMysql: 3330
        }
    }
}

module.exports = new Config();