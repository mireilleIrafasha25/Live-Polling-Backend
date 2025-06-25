// controllers/voteController.ts
import { RequestHandler } from "express";
import { AppDataSource } from "../config/database";
import { Poll } from "../models/poll";
import { getWss } from "../socket";

export const voteOnPoll: RequestHandler = async (req, res): Promise<void> => {
  const { code, option } = req.body;

  try {
    const pollRepo = AppDataSource.getRepository(Poll);
    const poll = await pollRepo.findOneBy({ code });

    if (!poll) {
      res.status(404).json({ success: false, message: "Poll not found" });
      return;
    }

    // Find the option in the poll
    const foundOption = poll.options.find((opt) => opt.name === option);

    if (!foundOption) {
      res.status(400).json({ success: false, message: "Invalid option selected" });
      return;
    }

    // Increment the vote count
    foundOption.voteCount = (foundOption.voteCount || 0) + 1;

    // Save the updated poll
    await pollRepo.save(poll);

    // 🔥 WebSocket broadcast
    const wss = getWss();
    const dataToBroadcast = {
      type: "voteUpdate",
      code: poll.code,
      options: poll.options,
    };

    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(dataToBroadcast));
      }
    });

    // Return response to the one who voted
    res.status(200).json({
      success: true,
      message: "Vote submitted",
      data: poll.options,
    });
  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPollProgress: RequestHandler = async (req, res): Promise<void> => {
  const pollId = req.params.pollId;
  const pollRepo = AppDataSource.getRepository(Poll);

  try {
    const poll = await pollRepo.findOneBy({ id: pollId });
    if (!poll) {
      res.status(404).json({ success: false, message: 'Poll not found' });
      return;
    }

    const result = poll.options.reduce((acc, opt) => {
      acc[opt.name] = opt.voteCount || 0;
      return acc;
    }, {} as Record<string, number>);

    res.status(200).json({ success: true, data: result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

