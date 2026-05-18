const Sequelize = require('sequelize');


const sequelize = new Sequelize({

    host : process.env.DB_HOST,
    port : process.env.DB_PORT,

    username : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,

    database : process.env.DB_NAME,
    dialect : 'mysql',
    dialectOptions: {
        ssl: false
    }
});

async function connectToDB() {
    try {
        // Test the database connection by trying to authenticate with the database using the Sequelize instance
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        //listens for changes in the models and updates the database accordingly
        await sequelize.sync();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = {
    sequelize,
    connectToDB
};
