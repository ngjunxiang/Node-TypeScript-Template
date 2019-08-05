import {Router} from "express";
import config from "../config/config";
import UserController from "../controllers/UserController";
import {checkJwt} from "../middlewares/checkJwt";
import {checkRole} from "../middlewares/checkRole";

const router = Router();

// Get all users
router.get(
    "/",
    [checkJwt, checkRole([config.roles.ADMIN])],
    UserController.listAll);

// Get one user by ID
// router.get(
//     "/id-:id([0-9]+)",
//     [checkJwt, checkRole([config.roles.ADMIN])],
//     UserController.getOneById
// );

// Get one user by email
router.get(
    "/:email",
    [checkJwt],
    UserController.getOneByEmail
);

// Create a new user
router.post(
    "/",
    [checkJwt, checkRole([config.roles.ADMIN])],
    UserController.newUser
);

// Edit one user
router.patch(
    "/:id([0-9]+)",
    [checkJwt, checkRole([config.roles.ADMIN])],
    UserController.editUser
);

// Delete one user
router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole([config.roles.ADMIN])],
    UserController.deleteUser
);

export default router;