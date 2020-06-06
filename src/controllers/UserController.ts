import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";

import {User} from "../entity/User";

class UserController {

    static listAll = async (req: Request, res: Response) => {
        // Get users from database
        const userRepository = getRepository(User);
        const users = await userRepository.find({
            select: ["id", "email", "firstName", "lastName", "contactNo", "role"] // We dont want to send the passwords on response
        });

        // Send the users object
        res.send({
            success: true,
            data: users,
            message: "users list"
        });
    };

    static getOneByEmail = async (req: Request, res: Response) => {
        // Get the ID from the url
        const email: string = req.params.email;

        // Get the user from database
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail({
                select: ["id", "email", "firstName", "lastName", "contactNo", "role"], where: {email} // We dont want to send the password on response
            });
            res.status(200).send({
                success: true,
                data: user,
                message: "user found"
            })
        } catch (error) {
            res.status(404).send({
                success: false,
                data: null,
                message: "user not found"
            });
        }
    };

    static getOneById = async (req: Request, res: Response) => {
        // Get the ID from the url
        const id: number = +req.params.id;
        
        // Get the user from database
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail(id, {
                select: ["id", "email", "firstName", "lastName", "contactNo", "role"] // We dont want to send the password on response
            });
        } catch (error) {
            res.status(404).send({
                success: false,
                data: null,
                message: "user not found"
            });
        }
    };

    static newUser = async (req: Request, res: Response) => {
        // Get parameters from the body
        let {email, firstName, lastName, password, contactNo, role} = req.body;
        let user = new User();
        user.email = email;
        user.firstName = firstName;
        user.lastName = lastName;
        user.password = password;
        user.contactNo = contactNo;
        user.role = role;

        // Validate if the parameters are ok
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send({
                success: false,
                data: errors,
                message: "parameters validation error"
            });
            return;
        }

        // Hash the password, to securely store on DB
        user.hashPassword();

        // Try to save. If fails, the email is already in use
        const userRepository = getRepository(User);
        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send({
                success: false,
                data: null,
                message: "email already in use"
            });
            return;
        }

        // If all ok, send 201 response
        res.status(201).send({
            success: true,
            data: null,
            message: "user created"
        });
    };

    static editUser = async (req: Request, res: Response) => {
        // Get the ID from the url
        const id = req.params.id;

        // Get values from the body
        const {email, firstName, lastName, contactNo, role} = req.body;

        // Try to find user on database
        const userRepository = getRepository(User);
        let user;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            // If not found, send a 404 response
            res.status(404).send({
                success: false,
                data: null,
                message: "user not found"
            });
            return;
        }

        // Validate the new values on model
        user.email = email;
        user.firstName = firstName;
        user.lastName = lastName;
        user.contactNo = contactNo;
        user.role = role;
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send({
                success: false,
                data: errors,
                message: "parameters validation error"
            });
            return;
        }

        // Try to save, if fails, that means email already in use
        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send({
                success: false,
                data: null,
                message: "email already in use"
            });
            return;
        }

        // After all send a 204 (no content, but accepted) response
        res.status(204).send({
            success: true,
            data: null,
            message: "user edited successfully"
        });
    };

    static deleteUser = async (req: Request, res: Response) => {
        // Get the ID from the url
        const id = req.params.id;

        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send({
                success: false,
                data: null,
                message: "user not found"
            });
            return;
        }
        userRepository.delete(id);

        //After all send a 204 (no content, but accepted) response
        res.status(204).send({
            success: true,
            data: null,
            message: "user deleted successfully"
        });
    };
};

export default UserController;
