// For repl.it
// eslint-disable-next-line @typescript-eslint/no-var-requires
import express from 'express';

const app: express.Application = express();
app.get('/', (_req, _res) => _res.send('Server is up.'));

module.exports = () => {
    app.listen(3000);
};
