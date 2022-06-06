// Should display all the tweets for the given user
// This file gets triggered dynamically , when the user types in the name 
// such as /yogi or /gijo, or any name. This is the dynamic routing and hence file is
// named as [name].js
// actually a href link is created in components/tweet.js. When the user clicks
// then this file is gets triggered dynamically, calling UserProfile() 
// We make use of calls from data.js (getUserTweets)

import prisma from 'lib/prisma'
import { getUserTweets } from 'lib/data.js'

import Tweets from 'components/Tweets'


export default function UserProfile({ name, tweets }) {
  return ( // fragment because we are calling tweets in a loop
          <>
            <p className='text-center p-5'>User profile of {name}</p>
            <Tweets tweets={tweets} />
          </>
        )
}

//params: If this page uses a dynamic route, params contains the route parameters. 
// If the page name is [id].js , then params will look like { id: ... }.
// Here the page name is [name].js, thus params.name
export async function getServerSideProps({ params }) {

    let tweets = await getUserTweets(params.name, prisma)
    tweets = JSON.parse(JSON.stringify(tweets))
    return {
        props: {
        name: params.name,
        tweets
        },
    }
}