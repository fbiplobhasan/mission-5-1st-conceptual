import { RequestHandler } from "express";
import { prisma } from "../../lib/prisma";

const createUsageLog: RequestHandler = async (req, res) => {
  const payload = req.body;
  try {
    const log = await prisma.usageLog.create({
      data: payload,
    });
    res.send({ message: "Log created successfully.", data: log });
  } catch (error) {
    res.send({ message: "Log creation failed." });
    console.error(error);
  }
};

const getUsageLog: RequestHandler = async (req, res) => {
  try {
    const log = await prisma.usageLog.findMany({
      include: { user: true, equipment: true },
    });
    res.send({ message: "All Log", data: log });
  } catch (error) {
    res.send({ message: "Log getting failed." });
    console.error(error);
  }
};

export const logController = {
  createUsageLog,
  getUsageLog,
};
