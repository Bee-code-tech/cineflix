
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import prismadb from '../../lib/prismadb'; // Update with the correct path to prismadb

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  console.log('register endpoint connected');
  
  if (req.method !== 'POST') {
      return res.status(405).end();
    }
  
    

  try {

    const { email, name, password }  = req.body as any;

    const existingUser = await prismadb.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(422).json({ error: 'Email taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prismadb.user.create({
      data: {
        email,
        name,
        hashedPassword,
        image: ' ',
        emailVerified: new Date(),
      },
    });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
