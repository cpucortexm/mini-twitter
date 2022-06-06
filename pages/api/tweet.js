// API route so we can POST this data to a Next.js serverless function.
// This the API route for /api/tweet called from the component NewTweet.js(indirectly from home page)

// Why we need serverless functions. Problem of hosting a website on a server?:
// As your site grows, you’ll have to spend more and more time provisioning,
// managing, or upgrading your server to ensure your site keeps running 
// smoothly. This will leave you less time to spend actually developing code.
// Instead, you could focus solely on writing code and get someone else to 
// handle the operational infrastructure of your site?
// That’s the idea behind serverless functions. 

// What is a serverless function ?
// A serverless function is a programmatic function written by a
// software developer for a single purpose. It's then hosted and 
// maintained on infrastructure by cloud computing companies. These 
// companies take care of code maintenance and execution so that 
// developers can deploy new code faster and easier.

import prisma from 'lib/prisma'
import { getSession } from 'next-auth/react'


export default async function handler(req, res) {
    // allow only delete and post
    if (req.method !== 'POST' && req.method !== 'DELETE') {
        return res.status(501).end()
    }
    const session = await getSession({ req })

    if (!session) {
        return res.status(401).json({ message: 'Not logged in' })
    }

    const user = await prisma.user.findUnique({
        where: {
        email: session.user.email,
       },
    })

    if (!user) {
        return res.status(401).json({ message: 'User not found' })
    }

    if (req.method === 'POST') 
    {
        //handle the POST request (writing the tweet to db)
        const tweet = await prisma.tweet.create({
            data: {
                content: req.body.content,
                parent: req.body.parent || null, // parent needed for reply tweet, else it will be NULL
                author: {
                    connect: { id: user.id },
                },
            },
        })
        const tweetWithAuthorData = await prisma.tweet.findUnique({
                where: {
                    id: tweet.id,
                },
                include: {
                    author: true,
                },
        });
        res.json(tweetWithAuthorData)
        return
    }
   // delete a particular tweet based on ID 
    if (req.method === 'DELETE') {
        const id = req.body.id

        const tweet = await prisma.tweet.findUnique({
            where: {
                id,
            },
            include: {
                author: true,
            },
        })

        if (tweet.author.id !== user.id) {
            res.status(401).end()
            return
        }

        await prisma.tweet.delete({
            where: { id },
            })
        res.status(200).end()
        return
    }

}