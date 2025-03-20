import db from "../models";
import { Request, Response } from "express";
import { INote } from "../models/notes.model";

const Notes = db.Notes;

export const createNote = async (req: Request, res: Response) => {
  try {
    const note: INote = new Notes({
      title: req.body.title,
      content: req.body.content,
      owner: req.body.owner,
    });

    await note.save();
    res.status(201).json({ message: "Note was created successfully!" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
