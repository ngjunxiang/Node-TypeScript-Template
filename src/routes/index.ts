import {Router} from "express";
import auth from "./auth";
import user from "./user";

const routes = Router();

// Authorisation endpoints
routes.use("/auth", auth);

// User endpoints
routes.use("/user", user);

export default routes;