import express from 'express'
import dotenv from 'dotenv'
import path from 'path'

const app = express();
dotenv.config()

app.use(express.static('dist'));
app.get('*', function (req, res) {
  res.sendFile(path.join(process.cwd(), "./dist", "index.html"));
})
app.listen(process.env.VITE_PORT, () => {
  console.log('Server running on port', process.env.VITE_PORT);
});
