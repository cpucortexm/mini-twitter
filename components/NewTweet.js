// interacts with the api routes in pages/api/tweet.js
// basically post, put, get etc

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function NewTweet({ tweets, setTweets }) {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const router = useRouter()  
	//don't display if we're not logged in
	if (!session || !session.user) return null

    const handleSubmit = async (event) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault()
         if (!content) {
          alert('No content')
          return
        }
        // Post the content to the API route /api/tweet
        const requestParams = {
            body: JSON.stringify({content,}),
            headers: {'Content-Type': 'application/json',},
            method: 'POST',
        }
        const res = await fetch('/api/tweet', requestParams);
        const tweet = await res.json()
        setTweets([tweet, ...tweets])
        // reload window to see the tweet we made
        // router.reload(window.location.pathname)
    }

  return (
    <form onSubmit={handleSubmit}>

      <div className='flex'>
        <div className='flex-1 px-1 pt-2 mt-2 mr-1 ml-1'>
          <textarea
            className='border p-4 w-full text-lg font-medium bg-transparent outline-none color-primary '
            rows={2}
            cols={50}
            placeholder="What's happening?"
            name='content'
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>

      <div className='flex'>
        <div className='flex-1 mb-5'>
          <button className='border float-right px-8 py-2 mt-0 mr-2 font-bold rounded-full'>
            Tweet
          </button>
        </div>
      </div>

    </form>
  )
}
