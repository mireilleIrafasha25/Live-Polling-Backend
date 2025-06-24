import { RequestHandler } from 'express';
import { AppDataSource } from '../config/database';
import { Poll } from '../models/poll';
import { AuthenticatedRequest } from '../types/common.types';
export const voteOnPoll: RequestHandler = async (req, res): Promise<void> => {
  const { pollId, selectedOption } = req.body;
  const userId = (req as AuthenticatedRequest).user?.id;

  try {
    const pollRepo = AppDataSource.getRepository(Poll);
    const poll = await pollRepo.findOneBy({ id: pollId });

    if (!poll) {
      res.status(404).json({ success: false, message: 'Poll not found' });
      return;
    }

    if (!poll.isActive) {
      res.status(400).json({ success: false, message: 'Poll has expired' });
      return;
    }

    //  Increase voteCount on the selected option
    const options = poll.options.map(option =>
      option.name === selectedOption
        ? { ...option, voteCount: (option.voteCount || 0) + 1 }
        : option
    );

    poll.options = options;
    await pollRepo.save(poll);

    res.status(200).json({ success: true, message: 'Vote counted!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
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

