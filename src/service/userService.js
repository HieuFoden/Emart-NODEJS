import db from "../models/index";

const getAllUsers = async () => {

    try {
        let users = await db.User.findAll({
            attributes: ['id', 'username', 'email', 'phone'],
            include: { model: db.Group, attributes: ['name', 'description'] }
        });
        if (users) {
            // console.log('>>>check user', users);
            return {
                EM: 'データ取得が成功',
                EC: 0,
                DT: users
            }
        } else {
            return {
                EM: 'データ取得が成功',
                EC: 0,
                DT: []
            }
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'サーバーには何かエラーがある',
            EC: 1,
            DT: []
        }
    }
};

const getUserWithPagination = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;

        const { count, rows } = await db.User.findAndCountAll({
            offset: offset,
            limit: limit,
            attributes: ['id', 'username', 'email', 'phone'],
            include: { model: db.Group, attributes: ['name', 'description'] }
        });

        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            users: rows
        };

        return {
            EM: 'データ取得が成功',
            EC: 0,
            DT: data
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'サーバーには何かエラーがある',
            EC: 1,
            DT: []
        }
    }
};

const createNewUser = async (data) => {
    try {
        await db.User.create({

        });
    } catch (error) {
        console.log(error);
    }
};

const updateUser = async (data) => {
    try {
        let user = await db.User.findOne({
            where: { id: data.id }
        });
        if (user) {
            //update
            user.save({

            });
        } else {
            //not found
        }
    } catch (error) {
        console.log(error);
    }
};

const deleteUser = async (id) => {
    try {
        let user = await db.User.findOne({
            where: { id: id }
        });
        if (user) {
            await user.destroy();
            return {
                EM: 'ユーザ削除が成功',
                EC: 0,
                DT: []
            }
        } else {
            return {
                EM: 'ユーザーが存在しません',
                EC: 2,
                DT: []
            }
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'サーバーには何かエラーがある',
            EC: 1,
            DT: []
        }
    }
};

module.exports = {
    getAllUsers, createNewUser, updateUser, deleteUser, getUserWithPagination
};