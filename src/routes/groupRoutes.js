const express = require("express");
const { check } = require("express-validator");
const { createGroup, getGroupById, getGroups, addUserToGroup, removeUserFromGroup, addUserToGroupByAdmin, getGroupUsers, getGroupAllUsers, getAllGroupUsers } = require("../controllers/groupControllers");

const { auth, superAdminUser, adminUser } = require("../middlewares/auth");
const router = express.Router();

router.post(
    "/create",
    [
        check("name", "name is requrired ").not().isEmpty(),
        check("savingsAmount", "savingsAmount is requrired ").not().isEmpty(),
        check("description", "Please specify the group description").not().isEmpty(),
        check("maxCapacity", "Please specify the group maximum Capacity").not().isEmpty(),
    ], auth, adminUser,
    createGroup
);
router.get('/members/:id', auth, adminUser, getAllGroupUsers)
router.get('/:id', getGroupById)
router.get('/', getGroups)
router.put('/add/:id', auth, addUserToGroup)
router.put('/add/:userId/:groupId', auth, adminUser, addUserToGroupByAdmin)
router.put('/remove/:id', removeUserFromGroup)


module.exports = router