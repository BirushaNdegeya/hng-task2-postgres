import express from 'express';
import cors from 'cors';


const app = express();
app.use(cors());
app.use(express.json());

app.use('*', function(req, res){
   res.send('not found');
});
export default app;