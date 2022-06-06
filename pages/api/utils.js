import prisma from 'lib/prisma'
import { faker } from '@faker-js/faker'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {

  const session = await getSession({ req })
  
  if (req.method !== 'POST') return res.end()

  //This deletes all tweets, and deletes all users that are not “us”, 
  // based on the session data.
  if (req.body.task === 'clean_database') {
    await prisma.tweet.deleteMany({})
    await prisma.user.deleteMany({
      where: {
        NOT: {
          email: {
            in: [session.user.email],
          },
        },
      },
    })
  }
  // creates 5 fake users, then 1 tweet for each user
  if (req.body.task === 'generate_users_and_tweets') {
      // create 5 fake users
        let count = 0
        while (count < 5) {
            await prisma.user.create({
            data: {
                name: faker.internet.userName().toLowerCase(),
                email: faker.internet.email().toLowerCase(),
                image: faker.internet.avatar(),
            },
        })
        count++
    }
    //create 1 tweet for each user
    const users = await prisma.user.findMany({})
    users.forEach(async (user) => {
        await prisma.tweet.create({
        data: {
            content: faker.hacker.phrase(),
            author: {
            connect: { id: user.id },
            },
        },
        })
    })
  }


  // get the list of users from the database, pick a random one
  // and then use the the faker library to create a fake phrase
  if (req.body.task === 'generate_one_tweet') {
    const users = await prisma.user.findMany({})

    const randomIndex = Math.floor(Math.random() * users.length)
    const user = users[randomIndex]

    await prisma.tweet.create({
        data: {
        content: faker.hacker.phrase(),
        author: {
            connect: { id: user.id },
        },
        },
    })  
}

  res.end()
}