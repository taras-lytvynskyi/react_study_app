const ClassesModel = require('../models/classes.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const UserModel = require('../models/user.model');
const UserController = require('../controller/user.controller');
const ContentModel = require('../models/content.model')
const TaskModel = require('../models/task.model')
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');


class ClassesController {
    // don't touch
    getAllClasses = async (req, res, next) => {
        let ClassesList = await ClassesModel.find();

        if(!ClassesList){
            res.send("Not Classes")
        }

        ClassesList = ClassesList.map(classes => {
            return classes;
        });

        res.send(ClassesList);
    };
    getAllUserClasess = async (params,res) => {
        const classes = await ClassesModel.findByUserCreated({user_created :params })
        res.send(classes);
    }

    connectToClass = async(res,code,user_id) => {
        const result = await ClassesModel.connectToClass(res,code,user_id);
        // res.status(201).send('Connect to class!', result);
        return result
    }

    getConnectedClasses = async(user_id,res) => {
        const connected_classes = await ClassesModel.findUserConnectedClasses({user_id:user_id})
        res.send(connected_classes)
    }

    getClassesById = async (req, res) => {
        const class_by_id = await ClassesModel.findById({ id: req });
        res.send(class_by_id);
    };

    getUserByuserName = async (req, res, next) => {
        const user = await UserModel.findOne({ username: req.params.username });
        if (!user) {
            throw new HttpException(404, 'User not found');
        }

        const { password, ...userWithoutPassword } = user;

        res.send(userWithoutPassword);
    };

    findUserConnect = async(clasid,res) => {
        const result = await ClassesModel.findUserConnect(clasid);
        return result
    }

    getCurrentUser = async (req, res, next) => {
        const { password, ...userWithoutPassword } = req.currentUser;

        res.send(userWithoutPassword);
    };

    findAllClassNews = async(clasid, res) => {
        const result = await ContentModel.findAllNews(clasid, res)
        if(!result){
            res.status(500).json({ message: "Something is wrong. Try again" });
        }
        return result
    }


    createContent = async(classId,content,userid,res) => {
        const result = await ContentModel.create(classId, content, userid)

        if(!result){
            res.status(500).json({ message: "Something is wrong. Try again" });
        }
        res.status(201)
    }

    sendTask = async(userid,taskid,file_task) => {
        try{
            const result = await TaskModel.sendTask(userid,taskid,file_task)
            return result
        }catch(e){
            console.log(e)
            res.status(500)
        }
    }

    findTaskById = async(tasksid) => {
        try{
        console.log("VVVVVVVVVVVVVVVVVVV")
        console.log(tasksid)
        const result = await TaskModel.findById(tasksid)
        console.log("VVVVVVVVVVVVVVVVVVV")
        console.log(result)
        return result
        }catch(e){
            console.log(e)
        }
    }

    createTask = async(classId,create_task_content,userid,res) => {
        try{
            const result = await TaskModel.create(classId,create_task_content,userid)
            console.log(create_task_content)
            return result
        }catch(e){
            console.log(e)
            throw res.status(500)
        }
    }

    findAllTasks = async(classid) => {
        try{
            const result = await TaskModel.findAllTasks(classid)
            return result
        }catch(e){
            console.log(e)
            throw res.status(500)
        }
    }

    findAllTasksWithoutRating = async(taskid,classid) => {
        try{
            const result = await TaskModel.findAllTasksWithoutRating(taskid,classid)
            return result
        }catch(e){
            console.log(e)
            throw res.status(500)
        }
    }
    createClass = async (req,res, next, user_id) => {
        const result = await ClassesModel.create(req,user_id);

        if (!result) {
            throw res.status(500)
        }

        return result;
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
        this.checkValidation(req);

        const { email, password: pass } = req;

        const user = await UserModel.findOne({ email });

        if (!user) {
            throw new HttpException(401, 'Unable to login!');
        }

        const isMatch = await bcrypt.compare(pass, user.password);

        if (!isMatch) {
            throw new HttpException(401, 'Incorrect password!');
        }

        // user matched!
        const secretKey = process.env.SECRET_JWT || "";

        const token = jwt.sign({ user_id: user.id.toString() }, secretKey, {
            expiresIn: '24h'
        });

        const { password, ...userWithoutPassword } = user;

        res.send({ ...userWithoutPassword, token });
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
        if (req.password) {
            req.password = await bcrypt.hash(req.password, 8);
        }
    }
}



module.exports = new ClassesController;