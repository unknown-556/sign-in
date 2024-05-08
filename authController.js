import User from './user.model.js';
import  cryptoHash  from 'crypto';
import { signUpValidator, signInValidator } from './auth.validator.js';
import { formatZodError } from './errorMessage.js';

function hashValue(value) {
    const hash = cryptoHash.createHash('sha256');
    hash.update(value);
    return hash.digest('hex');
}
 
 function comparePasswords(inputPassword, hashedPassword) {
    return hashValue(inputPassword) === hashedPassword;
  }
 

  export const signUp = async (req, res) => {
    const registerResults = signUpValidator.safeParse(req.body)
    if (!registerResults) {
        return res.status(400).json(formatZodError(registerResults.error.issues))
    }
    try {
        const {userName, phoneNumber, email}=req.body 
        const user = await User.findOne({for:[{email},{phoneNumber},{userName}]})
        if (user) {
            res.status(409).json({messaage:'User with email already exists'})
        } else {
            const {
                name,
                userName,
                password,
                confirmPassword,
                email,
                phoneNumber,
            } = req.body

             if (password !== confirmPassword) {
                 return res.status(403).json({ message: 'Password and confirmPassword do not match' });
              }   
            const encryption = hashValue(password, confirmPassword)
            const newUser = new User({
                name,
                userName,
                password: encryption,
                confirmPassword :encryption,
                email,
                phoneNumber,
            })
            await newUser.save()
            console.log('User registered succesfully',newUser)
            return res.redirect('log.html')
            ;
        }
    } catch (error) {
        res.status(500).json({message: error.message})
        console.log('INTERNAL SERVER ERROR',error.message)
    }
}


export const signIn = async (req, res, next) => {
    const loginResulta = signInValidator.safeParse(req.body)
    if (!loginResulta) {
        return res.status(400).json(formatZodError(loginResulta.error.issues))
    } try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({message: 'User with email not found'})
        }
        const comparePass = comparePasswords(password, user.password)
        if (!comparePass) {
            return res.status(400).json({message: 'Password is incorrect'})
        }
        
        return res.redirect('home.html') 
    } catch (error) {
        res.status(500).json({message: error.message})
        console.log('INTERNAL SERVER ERROR', error.message)
    }
}   
    
    


export const logout = async (req, res, next) => {

}

export default signUp;
