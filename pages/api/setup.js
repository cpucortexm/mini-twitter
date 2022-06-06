// API route for /api/setup called from the page setup.js.

import prisma from 'lib/prisma'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({ req })

  if (!session) return res.end()
  
  // get name from db to check if it already exists.
  // as username should be unique.
  const name = await prisma.user.findUnique({
      where: {
         name:   req.body.name,
      },
  })

  if (name)  // means name already exists, we can return with an error msg
  {
    return res.status(400).json({ message: 'User name already exists' })
  }

  else{  // update the new user name to db
    if (req.method === 'POST') {
      await prisma.user.update({
        where: { email: session.user.email },
        data: {
          name: req.body.name,
        },
    })
    res.end()
    }
  }
}