import {Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import {getRepository} from "typeorm";
import {validate} from "class-validator";
import {generate} from "generate-password";

import {User} from "../entity/User";
import config from "../config/config";
import EmailController from "./EmailController";

class AuthController {
    static login = async (req: Request, res: Response) => {
        // Check if email and password are set
        let {email, password} = req.body;

        if (!(email && password)) {
            res.status(400).send({
                success: false,
                data: null,
                message: "email or password is blank"
            });
        }

        // Get user from database
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({where: {email}});
        } catch (error) {
            res.status(401).send({
                success: false,
                data: null,
                message: "invalid email or password"
            });
        }

        // Check if encrypted password match
        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            res.status(401).send({
                success: false,
                data: null,
                message: "invalid email or password"
            });
            return;
        }

        // Sign JWT, valid for 1 hour
        const token = jwt.sign(
            {userId: user.id, email: user.email},
            config.jwtSecret,
            {expiresIn: "1h"}
        );

        // Send the jwt in the response
        res.status(200).send({
            success: true,
            data: {"authorization": token, "role": user.role},
            message: "login successful"
        });
    };

    static changePassword = async (req: Request, res: Response) => {
        // Get ID from JWT
        const id = res.locals.jwtPayload.userId;

        // Get parameters from the body
        const {oldPassword, newPassword} = req.body;
        if (!(oldPassword && newPassword)) {
            res.status(400).send({
                success: false,
                data: null,
                message: "new and old passwords do not match"
            });
        }

        // Get user from the database
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (id) {
            res.status(401).send({
                success: false,
                data: null,
                message: "no such user"
            });
        }

        // Check if old password matches
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            res.status(401).send({
                success: false,
                data: null,
                message: "old password does not match"
            });
            return;
        }

        // Validate the model (password length)
        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send({
                success: false,
                data: errors,
                message: "password validation error"
            });
            return;
        }

        // Hash the new password and save
        user.hashPassword();
        userRepository.save(user);

        res.status(204).send({
            success: true,
            data: null,
            message: "password changed successfully"
        });
    };

    static forgotPassword = async (req: Request, res: Response) => {
        let {email: email} = req.body;

        if (!email) {
            res.status(400).send({
                success: false,
                data: null,
                message: "email is blank"
            });
        }

        // Get user from database
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({where: {email: email}});
        } catch (error) {
            res.status(404).send({
                success: false,
                data: null,
                message: "invalid email"
            });
        }

        // Generate new random password
        let randPassword = generate({
            length: 10,
            numbers: true,
            symbols: true
        });

        user.password = randPassword;

        // Hash the new password and save
        user.hashPassword();
        userRepository.save(user);

        res.status(204).send({
            success: true,
            data: null,
            message: "password reset successfully"
        });


        // Send email with new password
        EmailController.sendForgotPasswordEmail(email, randPassword);
    }
}

export default AuthController;