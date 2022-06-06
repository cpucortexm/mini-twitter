import { useRouter } from 'next/router'
import { useState } from 'react'

export default function NewReply({ tweet }) {
  const router = useRouter()
  const [reply, setReply] = useState('')

    const handleSubmit = async (event) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault()
        if (!reply) {
          alert('Enter some text in the reply')
          return
        }
        // Post the content to the API route /api/tweet
        const requestParams = {
            body: JSON.stringify({
                    parent: tweet.id,
                    content: reply,
                }),
            headers: {'Content-Type': 'application/json',},
            method: 'POST',
        }
        await fetch('/api/tweet', requestParams);
        // reload window to see the tweet we made
        router.reload(window.location.pathname)
    }
  return (
    <form onSubmit = {handleSubmit}  className='flex ml-2'>
      <textarea
        className='border p-4 w-full text-lg font-medium bg-transparent outline-none color-primary '
        rows={1}
        cols={50}
        placeholder='Tweet your reply'
        onChange={(e) => setReply(e.target.value)}
      />
      <div className='flex'>
        <div className='flex-1 mb-5'>
          <button className='border float-right ml-2 px-8 py-2 mt-0 mr-8 font-bold rounded-full color-accent-contrast bg-color-accent hover:bg-color-accent-hover'>
            Reply
          </button>
        </div>
      </div>
    </form>
  )
}