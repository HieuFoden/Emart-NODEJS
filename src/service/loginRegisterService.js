import db from '../models/index';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { raw } from 'body-parser';

var salt = bcrypt.genSaltSync(10);

const hashUserPassword = (userPassword) => {

    let hashPassword = bcrypt.hashSync(userPassword, salt);
    return hashPassword;
};

const checkEmailExist = async (userEmail) => {
    let user = await db.User.findOne({
        where: { email: userEmail }
    });

    if (user) {
        return true;
    }

    return false;
};

const checkPhoneExist = async (userPhone) => {
    let user = await db.User.findOne({
        where: { phone: userPhone }
    });

    if (user) {
        return true;
    }

    return false;
};

const registerNewUser = async (rawDataUser) => {
    try {


        // check email/ phonenumber are exist
        let isEmailExist = await checkEmailExist(rawDataUser.email);
        if (isEmailExist === true) {
            return {
                EM: 'The email is already exsist',
                EC: 1
            }
        }
        let isPhoneExist = await checkPhoneExist(rawDataUser.phone);
        if (isPhoneExist === true) {
            return {
                EM: 'The phone number is already exsist',
                EC: 1
            }
        }
        //hash user password
        let hashPassword = hashUserPassword(rawDataUser.password);
        //create new user
        await db.User.create({
            email: rawDataUser.email,
            username: rawDataUser.username,
            password: hashPassword,
            phone: rawDataUser.phone
        });

        return {
            EM: 'A user is created successfully',
            EC: 0
        }
    } catch (e) {
        console.log(e);
        return {
            EM: 'Something wrong in server...',
            EC: -2
        }
    }
};



const checkPassword = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword); // true OR FALSE
};

const handleUserLogin = async (rawData) => {
    try {

        let user = await db.User.findOne({
            where: {
                // OP.or : toan tu hoac
                [Op.or]: [
                    { email: rawData.valueLogin },
                    { phone: rawData.valueLogin }
                ]
            }
        });

        if (user) {
            console.log('>>>found user with email/phone')
            let isCorrectPassword = checkPassword(rawData.password, user.password);
            if (isCorrectPassword === true) {
                return {
                    EM: 'ok!',
                    EC: 0,
                    DT: ''
                }
            }
        }
        console.log('>>>INput user with email/phone : ', rawData.valueLogin, 'password: ', rawData.password);
        return {
            EM: 'Your email/phone number/ password is incorrect',
            EC: 1,
            DT: ''
        };

    } catch (e) {
        console.log(e);
        return {
            EM: 'Something wrong in server...',
            EC: -2
        }
    }
};
module.exports = {
    registerNewUser, handleUserLogin
};