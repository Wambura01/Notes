import { Router, RequestHandler } from "express";
import { createNote } from "../controllers/notes.controller";

const router = Router();

/**
 * @swagger
 * /api/notes:
 *   post:
 *     tags:
 *       - Notes
 *     summary: Create a new note
 *     description: Creates a new note with title and content
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: Note's title
 *               content:
 *                 type: string
 *                 description: Note's content
 *     responses:
 *       201:
 *         description: Note created successfully
 *       400:
 *         description: Invalid input or validation error
 *       500:
 *         description: Server error
 */

router.post("/create-note", createNote as RequestHandler);

export default router;
