import { Router, RequestHandler } from "express";
import {
  allAccess,
  adminBoard,
  moderatorBoard,
  userBoard,
} from "../controllers/user.controller";
import { authJwt } from "../middlewares";

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Public content
 *     description: Get public content accessible to all users
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Public content message
 */
router.get("/", allAccess as RequestHandler);

/**
 * @swagger
 * /api/users/user:
 *   get:
 *     tags:
 *       - Users
 *     summary: User content
 *     description: Get content accessible to authenticated users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: User content message
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *       404:
 *         description: User not found
 */
router.get(
  "/user",
  [authJwt.verifyToken] as RequestHandler[],
  userBoard as RequestHandler
);

/**
 * @swagger
 * /api/users/moderator:
 *   get:
 *     tags:
 *       - Users
 *     summary: Moderator content
 *     description: Get content accessible to moderators only
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Moderator content message
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *       403:
 *         description: Forbidden - Requires moderator role
 *       404:
 *         description: User not found
 */
router.get(
  "/moderator",
  [authJwt.verifyToken, authJwt.isModerator] as RequestHandler[],
  moderatorBoard as RequestHandler
);

/**
 * @swagger
 * /api/users/admin:
 *   get:
 *     tags:
 *       - Users
 *     summary: Admin content
 *     description: Get content accessible to administrators only
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Admin content message
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *       403:
 *         description: Forbidden - Requires admin role
 *       404:
 *         description: User not found
 */
router.get(
  "/admin",
  [authJwt.verifyToken, authJwt.isAdmin] as RequestHandler[],
  adminBoard as RequestHandler
);

export default router;
