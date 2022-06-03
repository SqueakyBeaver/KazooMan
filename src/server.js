// For repl.it
import express from 'express';



export function server() {
    const app = express();
    app.get('/', (req, res) => res.send('Server is up.'));
    
    app.listen(3000);
}

