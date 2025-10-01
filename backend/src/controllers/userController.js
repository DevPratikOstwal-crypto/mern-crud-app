import User from "../models/User.js";
import { validationResult } from "express-validator";
import { toCSV } from "../utils/csv.js";
import path from "path";

export const createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const payload = { ...req.body };
    if (req.file) payload.profileUrl = `/uploads/${req.file.filename}`;

    const user = await User.create(payload);
    res.status(201).json(user);
  } catch (e) { next(e); }
};

export const getUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      gender,
      sort = "createdAt",
      order = "desc"
    } = req.query;

    const q = {};
    if (search) {
      q.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }
    if (status) q.status = status;
    if (gender) q.gender = gender;

    const skip = (Number(page) - 1) * Number(limit);
    const [rows, total] = await Promise.all([
      User.find(q).sort({ [sort]: order === "desc" ? -1 : 1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(q)
    ]);

    res.json({
      data: rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (e) { next(e); }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (e) { next(e); }
};

export const updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const payload = { ...req.body };
    if (req.file) payload.profileUrl = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (e) { next(e); }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Deleted" });
  } catch (e) { next(e); }
};

export const exportCSV = async (req, res, next) => {
  try {
    const { search = "" } = req.query;
    const q = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ]
        }
      : {};

    const rows = await User.find(q).lean();
    const csv = toCSV(rows);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="users.csv"`);
    res.status(200).send(csv);
  } catch (e) { next(e); }
};
