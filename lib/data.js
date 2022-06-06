//This gets all the tweets, ordered by `id` in descending order (latest is first).
//Notice we accept the `prisma` instance as a parameter. We’ll pass it from 
// the Next.js page component (e.g. home.js)


// get all tweets with the number of tweets given by the param (take)
// - cursor which will be the id of the last tweet we got, so that when we 
// call prisma.tweet.findMany() Prisma will return take elements starting
// from the element with id equal to the one we pass in cursor.
export const getTweets = async (prisma, take, cursor) => {
  return await prisma.tweet.findMany({
    where: {
       parent: null, //We don’t want to see replies in /home, nor in the user profile page.
                     // We only want to see them in the single tweet view.
    },
    orderBy: [
      {
        id: 'desc'
      }
    ],
    include: {
      author: true,
    },
    take,  // number of tweets, If take is not set, it’s null and 
          // by default it will get all tweets as before. 
    cursor,
    skip: cursor ? 1 : 0,
  })
}

// gets tweets for a particular user
export const getUserTweets = async (name, prisma) => {
  const tweets = await prisma.tweet.findMany({
    where: {
      author: {
        name: name,
      },
      parent: null, // We don’t want to see replies in /home, nor in the user profile page. 
                    // We only want to see them in the single tweet view.
    },
    orderBy: [
      {
        id: 'desc',
      },
    ],
    include: {
      author: true,
    },
  })
  return tweets
}

// a single tweet based on id
export const getTweet = async (id, prisma) => {
  const tweet = await prisma.tweet.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      author: true,
    },
  })
  return tweet
}

// This is for tweet replies
export const getReplies = async (id, prisma) => {
  const tweets = await prisma.tweet.findMany({
    where: {
      parent: parseInt(id),
    },
    orderBy: [
      {
        id: 'desc',
      },
    ],
    include: {
      author: true,
    },
  })

  return tweets
}