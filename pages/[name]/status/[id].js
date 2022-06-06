// This file is the default call if nothing else matches in API.
// e.g. /yogi/status/23, thus SingleTweet gets automatically called.
// This file is added to see a single tweet of an user.
// i.e. if the user clicks on the time of tweet link, this gets triggered
// Check Tweet.js, where we added href link to href: /name/status/id
// Again this is dynamic routing

// + in addition we also allow the user to delete a single tweet if he is in
// this view

import Tweet from 'components/Tweet'
import NewReply from 'components/NewReply'
import Tweets from 'components/Tweets'
import { getTweet, getReplies } from 'lib/data.js'
import prisma from 'lib/prisma'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'



export default function SingleTweet({ tweet, replies}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  // check for typeof window !== 'undefined' since we must run any router 
  // code in the client-side, not on the server-side.
  // Tweet must not be a reply ie. if it is a reply(has a parent) then
  // we move back to the parent tweet
  if (typeof window !== 'undefined' && tweet.parent) {
    router.push(`/${tweet.author.name}/status/${tweet.parent}`)
  }
  //  only show the JSX that contains the delete link if the user 
  // is logged in and if they are the tweet’s authors
  // <Tweets tweets={replies}/> to show the replies
  return (
          <div>
                <Tweet tweet={tweet} />
                <NewReply tweet={tweet} />
                <Tweets tweets={replies}  nolink={true}/>

              {
                  session && session.user.email === tweet.author.email && (
                <div className='flex-1 py-2 m-2 text-center'>
                  <a
                      href='#'
                      className='flex items-center w-12 px-3 py-2 mt-1 text-base font-medium leading-6 text-gray-500 rounded-full group hover:bg-color-accent-hover hover:color-accent-hover'
                      onClick={async () => {
                        const res = await fetch('/api/tweet', {
                          body: JSON.stringify({
                            id: tweet.id,
                          }),
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          method: 'DELETE',
                        })

                        if (res.status === 401) {
                          alert('Unauthorized')
                        }
                        if (res.status === 200) {
                          router.push('/home')
                        }
                      }}
                    >
                      delete
                  </a>
                </div>
               )
              }
          </div>
       )
}

// gets called and rendered on server with params passed with the values
// of dyna
export async function getServerSideProps({ params }) {

    let tweet = await getTweet(params.id, prisma)
    tweet = JSON.parse(JSON.stringify(tweet))

   	let replies = await getReplies(params.id, prisma)
    replies = JSON.parse(JSON.stringify(replies))

  return {
    props: {
      tweet,
      replies
    },
  }
}