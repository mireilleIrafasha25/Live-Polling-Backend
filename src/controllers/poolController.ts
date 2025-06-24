import { AuthenticatedRequest, ApiResponse } from '../types/common.types';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AppDataSource } from '../config/database';
import { Poll } from '../models/poll';
import { generatePollCode } from '../utils/generateCode';
import { User, UserRole } from '../models/userEntity';
import { Admin } from 'typeorm';

const userRepository = AppDataSource.getRepository(User);
export const createPoll : RequestHandler = async (
  req,
  res,
  next
):Promise<void> => {
  const { title, description, options, startTime, endTime, isAnonymous } = req.body;
   const userId = (req as AuthenticatedRequest).user?.id;
   const user = await userRepository.findOneBy({ id: userId });

if (!user) {
  res.status(401).json({ success: false, message: 'User not found' });
  return;
}
  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
    return;
  }
  // ✅ Validate date fields
  if (!startTime || !endTime || isNaN(Date.parse(startTime)) || isNaN(Date.parse(endTime))) {
    res.status(400).json({
      success: false,
      message: 'Invalid startTime or endTime format',
    });
    return;
  }
  try {
    const pollRepository = AppDataSource.getRepository(Poll);

    const poll = new Poll();
    poll.title = title;
    poll.description = description;
    poll.options = options;
    poll.code = generatePollCode();
    poll.startTime = new Date(startTime);
    poll.endTime = new Date(endTime);
    poll.isAnonymous = isAnonymous;
    poll.createdBy = user;
    poll.isActive = true;

    const savedPoll = await pollRepository.save(poll);

    res.status(201).json({
      success: true,
      message: 'Poll created successfully',
      data: {
        code: savedPoll.code,
        poll: savedPoll,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const becomeAdmin :RequestHandler = async (req: Request, res: Response):Promise<void> => {
  const user = (req as AuthenticatedRequest).user;

  if (!user) {
  res.status(401).json({ success: false, message: "Unauthorized" });
  return
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    user.role = UserRole.ADMIN; // Change role to admin
    await userRepository.save(user);
    res.status(200).json({ success: true, message: "Role changed to admin" });
    return
  } catch (error) {
    console.error("Role change error:", error);
  res.status(500).json({ success: false, message: "Server error" });
  return
  }
};

// export const getPolls : RequestHandler = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const pollRepository = AppDataSource.getRepository(Poll);
//     const polls = await pollRepository.find({
//       where: { isActive: true },
//       order: { createdAt: 'DESC' },
//     });

//     res.status(200).json({
//       success: true,
//       data: polls,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//     });
//   }
// };

export const getPollByCode: RequestHandler = async (req, res):Promise<void> => {

  try {
    const pollRepo = AppDataSource.getRepository(Poll);
    const poll = await pollRepo.findOne({
      where: { code:req.body.code }
    });

    if (!poll) {
     res.status(404).json({ success: false, message: 'Poll not found' });
     return
    }
    const now = new Date();
    if (poll.endTime < now) {
      res.status(200).json({
        success: true,
        message: 'Poll has expired'
      });
      return;
    }
   res.status(200).json({ success: true, data: poll });
   return
  } catch (error) {
    console.error(error);
   res.status(500).json({ success: false, message: 'Server error' });
   return
  }
};


export const getMyPolls: RequestHandler = async (req, res):Promise<void> => {
  const userId = (req as AuthenticatedRequest).user?.id;
  if (!userId) {
   res.status(401).json({ success: false, message: 'Unauthorized' });
   return
  }

  try {
    const pollRepo = AppDataSource.getRepository(Poll);
    const myPolls = await pollRepo.find({ where: { createdBy: { id: userId } } });

  res.status(200).json({ success: true, data: myPolls });
  return
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updatePoll: RequestHandler = async (req, res): Promise<void> => {
  const pollid=req.params.pollid
  const { title, description, options, startTime, endTime, isAnonymous } = req.body;
  const userId = (req as AuthenticatedRequest).user?.id;

  try {
    const pollRepo = AppDataSource.getRepository(Poll);
    const poll = await pollRepo.findOne({
      where: { id: pollid },
      relations: ['createdBy'],
    });

    if (!poll) {
      res.status(404).json({ success: false, message: 'Poll not found' });
      return
    }
    // Check if user is the creator of the poll
if (!poll.createdBy || poll.createdBy.id !== userId) {
  res.status(403).json({ success: false, message: 'You are not allowed to update this poll' });
  return;
}


    //  Check if poll is still active
    if (!poll.isActive) {
      res.status(400).json({ success: false, message: 'Poll has expired, cannot update it' });
      return
    }

    // Update
    if (title) poll.title = title;
    if (description) poll.description = description;
    if (Array.isArray(options)) poll.options = options;
    if (startTime) poll.startTime = new Date(startTime);
    if (endTime) poll.endTime = new Date(endTime);
    if (typeof isAnonymous === 'boolean') poll.isAnonymous = isAnonymous;

    const updatedPoll = await pollRepo.save(poll);

    res.status(200).json({
      success: true,
      message: 'Poll updated successfully',
      data: updatedPoll,
    });

  } catch (error) {
    console.error('Update poll error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
