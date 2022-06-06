// pages are special in Next.js as they create automatic routing,
// and pages support functions like getStaticprops(), getServerSideProps() etc which
// are special functions. Thus we can create components folder with files that can return 
// necessary JSX values.
// Components help in organising the code better in next.js. In next.js it is also
// possible to implement all the logic even without the components.


import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import NewTweet from 'components/NewTweet'
import Tweets from 'components/Tweets'
import prisma from 'lib/prisma'
import { getTweets } from 'lib/data.js'
import LoadMore from 'components/LoadMore'
import { useState } from 'react'

export default function Home({initialTweets}) { // tweets param comes from getServerSideProps()
  const [tweets, setTweets] = useState(initialTweets)
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const router = useRouter()
  // Why session is not available immediately ?
  // Next.js sends the page from the server, but the session data
  // is only available on the client(browser) when the browser has loaded and 
  // cookies are available(session data is stored in the cookies).
  // Session data must be verified on the client and thus it has the loading state until then

  if (loading)
  {
      return <p>...</p>
  }
  // If we are not logged in, we redirect the user to root = /
  // as there’s no “home” for users that are logged out.
  if (!session) {
    router.push('/')
  }
  
  if (session && !session.user.name) // session is available, but user name is not set
  {
    router.push('/setup')
  }

  // We pass setTweets as a prop to the LoadMore component in Home
  return (
     <>
         <NewTweet tweets={tweets} setTweets={setTweets} />
         <Tweets tweets={tweets}/>
         <LoadMore tweets={tweets} setTweets={setTweets} />
     </>
  )
}

// executes on server (server rendering), next js calls this when uit renders
// the home page
// gets all tweet data from db
export async function getServerSideProps() {
	let tweets = await getTweets(prisma, 2)
  // JSON  serializing must be done, else it throws an error
  tweets = JSON.parse(JSON.stringify(tweets))

  return {
    props: {
      initialTweets: tweets, // this must be accepted as param in Home() function above
    },
  }
}