const User = require("../models/userModels");
const Group = require("../models/groupModel");
const { validationResult } = require("express-validator");

//@desc CREATE GROUP
//@route POST: /api/group/create
//access PRIVATE

exports.createGroup = async (req, res) => {
    const { name, description, maxCapacity, savingsAmount } = req.body;
    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(400).json({
            statusCode: 400,
            message: result.array(),
        });
    }
    try {

        const existingGroup = await Group.findOne({ name })

        if (existingGroup) {
            return res.status(400).json({
                statusCode: 400,
                message: "Group name already exist",
            });
        }
        const newGroup = new Group({
            name,
            description,
            maxCapacity,
            savingsAmount,
            private: true,
            admin: req.user.id,
            approved: true,
        });
        await newGroup.save();

        res.status(201).json({
            statusCode: 201,
            newGroup
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            statusCode: 500,
            message: "Server error",
        });
    }
};

// Get Groups

//@desc GET ALL GROUPS
//@route GET: /api/group/
//access PRIVATE

exports.getGroups = async (req, res) => {

    //Search parameters
    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: "i",
            },
        }
        : {};
    try {
        const groups = await Group.find({ ...keyword })
        if (!groups) {
            return res.status(404).json({
                statusCode: 404,
                message: "No Groups found",
            });
        }
        res.status(200).json({
            statusCode: 200,
            groups
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            statusCode: 500,
            message: "Server error",
        });
    }
};


//@desc GET ALL GROUPS
//@route GET: /api/group/:groupid
//access Public

exports.getGroupById = async (req, res) => {

    // console.log("hello");
    const groupId = req.params.id
    try {
        const group = await Group.findById(groupId)
        if (!group) {
            return res.status(404).json({
                statusCode: 404,
                message: `No Group with the id ${groupId} was found`,
            });
        }
        res.status(200).json({
            statusCode: 200,
            group
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            statusCode: 500,
            message: "Server error",
        });
    }
};

//@desc GET List Of Users
//@route GET: /api/group/users
//access PRIVATE
exports.getAllGroupUsers = async (req, res) => {
    const groupId = req.params.id
    try {
        const group = await Group.findById(groupId)
        if (!group) {
            return res.status(404).json({
                statusCode: 404,
                message: `No Group with the id ${groupId} was found`,
            });
        }
        res.status(200).json({
            statusCode: 200,
            users: group.users
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            statusCode: 500,
            message: "Server error",
        });
    }
}
// Add User to Group
//@desc ADD USERS TO GROUP
//@route PUT: /api/group/:groupId
//access PRIVATE

exports.addUserToGroup = async (req, res) => {
    const groupId = req.params.id
    const userId = req.user.id
    try {
        const group = await Group.findById(groupId)
        if (!group) {
            return res.status(404).json({
                statusCode: 404,
                message: "No Groups found",
            });
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: " User not found",
            });
        }

        const existingGroupMember = group.users.find(
            (user) => user._id.toString() === userId
        );

        if (existingGroupMember) {
            return res.status(400).json({
                message: "User is already a group Member",
            });
        }
        if (group.users.length === group.maxCapacity) {
            return res.status(400).json({
                message: "The group maximum capacity has been reached ",
            });
        }
        group.users.push(userId);

        await group.save()
        res.status(400).json({
            message: "User has been added to the group ",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            statusCode: 500,
            message: "Server error",
        });
    }
};
// Add User to Group By Admin
//@desc ADD USERS TO THE GROUP BY ADMIN
//@route PUT: /api/group/:groupId/:userId
//access PRIVATE

exports.addUserToGroupByAdmin = async (req, res) => {
    const groupId = req.params.groupId
    const userId = req.params.userId
    try {
        const group = await Group.findById(groupId)
        if (!group) {
            return res.status(404).json({
                statusCode: 404,
                message: "No Groups found",
            });
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: " User not found",
            });
        }

        const existingGroupMember = group.users.find(
            (user) => user._id.toString() === userId
        );

        if (existingGroupMember) {
            return res.status(400).json({
                message: "User is already a group Member",
            });
        }
        if (group.users.length === group.maxCapacity) {
            return res.status(400).json({
                message: "The group maximum capacity has been reached ",
            });
        }
        group.users.push(userId);

        await group.save()
        res.status(400).json({
            message: "User has been added to the group ",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            statusCode: 500,
            message: "Server error",
        });
    }
};

// Remove User From Group
//@desc REMOVE USER FROM GROUP
//@route PUT: /api/group/:groupId/:userId
//access PRIVATE

exports.removeUserFromGroup = async (req, res) => {
    const groupId = req.params.id
    const userId = req.user.id
    try {
        const group = await Group.findById(groupId)
        if (!group) {
            return res.status(404).json({
                statusCode: 404,
                message: "No Groups found",
            });
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: " User not found",
            });
        }

        const existingGroupMember = group.users.find(
            (user) => user._id.toString() === userId
        );

        if (!existingGroupMember) {
            return res.status(400).json({
                message: "User is not a group Member",
            });
        }
        const userIndex = group.users
            .map((user) => user._id.toString() === userId)
            .indexOf(userId);
        group.users.splice(userIndex, 1);
        group.users.push(userId);

        //save updated group record
        await group.save()
        res.status(400).json({
            message: "User has been removed to the group ",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            statusCode: 500,
            message: "Server error",
        });
    }
};

//@desc DELETE GROUP
//@route DELETE: /api/group/:groupid
//access Public

exports.deleteGroups = async (req, res) => {
    const groupId = req.params.id
    const userId = req.user.id
    try {
        const group = await Group.findById(groupId)
        if (!group) {
            return res.status(404).json({
                statusCode: 404,
                message: "No Group with the id was found",
            });
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: " User not found",
            });
        }

        if (user._id.toString() === group.admin.toString() || !user.isSuperAmin) {
            return res.status(401).json({
                statusCode: 401,
                message: " User not authorized",
            });
        }

        const removedGroup = await Group.findByIdAndDelete(groupId)
        res.status(200).json({
            statusCode: 200,
            removedGroup
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            statusCode: 500,
            message: "Server error",
        });
    }
};
