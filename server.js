const appPromise = require('./app');
const port = process.env.PORT;

appPromise.then((app) =>{
    app.listen(port, () => {
    console.log("Server listening on port" + port);

})});
exports.module = appPromise;





