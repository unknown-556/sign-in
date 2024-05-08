import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { join } from 'path'
import signUpController from './authController.js'
// import signInController from './authController.js'
import { signIn } from './authController.js'
import connectDB from './database.js'
import router from './index.js'
import user from './user.model.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();



app.use(cors({origin:"*"}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/api/v1', router)
app.use(express.static(join(__dirname, 'public')));

app.post('/sign_up', signUpController);

app.post('/log_in', signIn);
  

app.get('/api/v1', (req,res)=> {
    return res.redirect('log.html')
})


 
const startServer  = async () => {
   const PORT  = process.env.PORT || 5595
   connectDB()
   try {
      app.listen(PORT,() => {console.log(`APP IS RUNNING ON PORT: ${PORT}`);})
   } catch (error) {
      console.log(error);
   }
};

startServer();

app.get("/", (req,res) => {
   return res.redirect('log.html')
})