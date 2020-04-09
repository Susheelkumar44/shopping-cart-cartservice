const mongoose = require('mongoose');
const dbConfig = require('./dbCreds')
module.exports = function (app) {
    mongoURL = dbConfig.dbType + '://' + dbConfig.host + '/' + dbConfig.dbName;
    mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

    process.on("SIGINT", cleanup);//On pressing ctrl+C, nothing but terminate
    process.on("SIGTERM", cleanup);//when the process is killed
    process.on("SIGHUP", cleanup);//signal generated on Windows when the console window is closed and similar events

    if (app) {
        app.set("mongoose", mongoose);
    }
};

function cleanup() {
    mongoose.connection.close(function () {
        process.exit(0);
    });
}