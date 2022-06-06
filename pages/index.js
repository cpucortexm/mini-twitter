
import { signOut,useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Tweets from 'components/Tweets'
import prisma from 'lib/prisma'
import { getTweets } from 'lib/data.js'
import Link from 'next/link'

export default function Welcome({tweets}) {

/*
  useSession() returns an object containing two values: data and status
  data: This can be three values: Session / undefined / null.
  when the session hasn't been fetched yet, data will undefined
  in case it failed to retrieve the session, data will be null
  in case of success, data will be Session.

  status: enum mapping to three possible session states: "loading" | "authenticated" | "unauthenticated
*/

  const { data: session, status } = useSession()
  const router = useRouter()

    if (status === 'loading') 
    {
      return null
    }

    if (session) {
      router.push('/home')
    }
    // When the user is logged out. 
    // Techinque 1: Get all the tweets and display only latest 3 tweets
    // using tweets.slice() as in Tweets tweets={tweets.slice(0, 3)} 

    // Technique: owever getting all the tweets is costly, so we can restrict it
    // by getting exactly latest 3 tweets
    return (
           	<div className='mt-10'>
               <Tweets tweets={tweets} />
              <p className='text-center p-4 border m-4'>
                <h2 className='mb-10'>Join the conversation!</h2>
                  <Link href="/api/auth/signin">
                    <a
                      className='border px-8 py-2 mt-5 font-bold rounded-full color-accent-contrast bg-color-accent hover:bg-color-accent-hover-darker'
                    >
                    login
                    </a>
                  </Link>
              </p>
            </div>  
          )
}



export async function getServerSideProps() {
  const take = 3 // We need only the latest 3 tweets to be displayed.
	let tweets = await getTweets(prisma, take)
  tweets = JSON.parse(JSON.stringify(tweets))

  return {
    props: {
      tweets,
    },
  }
}