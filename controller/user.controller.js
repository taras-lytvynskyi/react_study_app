const UserModel = require('../models/user.model');
const nodemailer = require('nodemailer');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

class UserController {
    getAllUsers = async (req, res, next) => {
        let userList = await UserModel.find();
        if (!userList.length) {
            throw new HttpException(404, 'Users not found');
        }

        userList = userList.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.send(userList);
    };

    getUserById = async (req, res, next) => {
        try{
            const user = await UserModel.findOne({ id: req });
            if (!user) {
                throw new HttpException(404, 'User not found');
            }
            console.log(user.name)
    
            // const { password, ...userWithoutPassword } = user;
    
            return user;
        }catch(e){
            console.log(e)
        }
    };

    getUserByuserName = async (req, res, next) => {
        const user = await UserModel.findOne({ username: req.params.username });
        if (!user) {
            throw new HttpException(404, 'User not found');
        }

        const { password, ...userWithoutPassword } = user;

        res.send(userWithoutPassword);
    };

    getCurrentUser = async (req, res, next) => {
        const { password, ...userWithoutPassword } = req.currentUser;

        res.send(userWithoutPassword);
    };

    // Для востановления пароля!
    findUserByEmail = async (email,res) => {
        const result = await UserModel.findUserByEmail(email)
        if(result){
            return result
        }else{
            return res.status(500)
        }
    }

    createUser = async (req, res, next) => {
        try{
            this.checkValidation(req);

            await this.hashPassword(req);
    
            const result = await UserModel.create(req);
    
            if (!result) {
                throw res.status(500).json({ message: "Something is wrong. Try again" });
            }
    
            return res.status(201)
        }catch(e){
            console.log(e)
        }
    };

    updateUser = async (req, res, next) => {
        this.checkValidation(req);

        await this.hashPassword(req);

        const { confirm_password, ...restOfUpdates } = req.body;

        // do the update query and get the result
        // it can be partial edit
        const result = await UserModel.update(restOfUpdates, req.params.id);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'User not found' :
            affectedRows && changedRows ? 'User updated successfully' : 'Updated faild';

        res.send({ message, info });
    };

    deleteUser = async (req, res, next) => {
        const result = await UserModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'User not found');
        }
        res.send('User has been deleted');
    };

    userLogin = async (req, res, next) => {
        try{
            this.checkValidation(req);

            const { email, password: pass } = req;
    
            const user = await UserModel.findOne({ email });
    
            if (!user) {
                throw res.status(401).json({message: "Unable to login!"})
            }
    
            const isMatch = await bcrypt.compare(pass, user.password);
    
            if (!isMatch) {
                throw res.status(500).json({ message: "Не верные данные!" });
            }
    
            // user matched!
            const secretKey = process.env.SECRET_JWT || "";
    
            const token = jwt.sign({ user_id: user.id.toString() }, secretKey, {
                expiresIn: '24h'
            });
    
            const { password, ...userWithoutPassword } = user;
    
            res.send({ ...userWithoutPassword, token });
        }catch(e){
            console.log(e)
        }
       
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(errors)
            throw new HttpException(400, 'Validation faild', errors);
        }
    }
    // hash password if it exists
    hashPassword = async (req) => {
        console.log(req.password)
        console.log(req)
        if (req.password) {
            req.password = await bcrypt.hash(req.password, 8);
        }
    }
}

module.exports = new UserController;