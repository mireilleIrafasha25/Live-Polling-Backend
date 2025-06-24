import cron from 'node-cron';
import { AppDataSource } from '../config/database';
import { Poll } from '../models/poll';
import { User, UserRole } from '../models/userEntity';
import { LessThan } from 'typeorm';

export const pollExpirationJob = () => {
  cron.schedule('*/1 * * * *', async () => {
     console.log('Checking for expired polls...');

    const pollRepo = AppDataSource.getRepository(Poll);
    const userRepo = AppDataSource.getRepository(User);

    const now = new Date();

    const expiredPolls = await pollRepo.find({
      where: {
        endTime: LessThan(now),
        isActive: true
      }
    });

    for (const poll of expiredPolls) {

      poll.isActive = false;
      await pollRepo.save(poll);

    
      const user = await userRepo.findOne({ where: { id: poll.createdBy.id } });

      if (user && user.role === 'admin') {
        user.role = UserRole.USER;
        await userRepo.save(user);

        console.log(`User ${user.email} role changed to 'user' after poll expired`);
      }
    }
  });
};
