// For repl.it
const app = require('express')();

app.get('/', (req: any, res :any) => res.send('Server is up.'));

module.exports = () => {
    app.listen(3000);
};
