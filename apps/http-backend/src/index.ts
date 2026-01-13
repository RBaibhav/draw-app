import express from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());  



app.listen(PORT, () => {
  console.log(`listeing to port ${PORT}`)
})