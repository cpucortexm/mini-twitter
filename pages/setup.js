// This page for user to setup his user name after login

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Setup() {
    const { data: session,status } = useSession()
    const [name, setName] = useState('')
    const router = useRouter()
    const loading = status === 'loading'

    if (!session || !session.user) 
    {
        return null
    }

    if (loading){
        return null
    }
    // if the session user name already exists, go to home page
    if (!loading && session.user.name) {
        router.push('/home')
    }


    const handleSubmit = async (event) => {
       // Stop the form from submitting and refreshing the page.
        event.preventDefault()
        // Post the content to the API route /api/setup for the user name 
        const requestParams = {
            body: JSON.stringify({name,}),
            headers: {'Content-Type': 'application/json',},
            method: 'POST',
        }
        const result = await fetch('/api/setup', requestParams)

        // Check if the user name already exists, if yes return to the
        // same page
        // Needs further improvement of displaying the message to the user
        if (result.status == 400){
          router.push('/setup')
          return
        }
        session.user.name = name
        router.push('/home')
    }

  return (
    <form
      className='mt-10 ml-20' onSubmit={handleSubmit}
    >
      <div className='flex-1 mb-5'>
        <div className='flex-1 mb-5'>Username</div>
        <input
          type='text'
          name='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='border p-1'
        />
      </div>

      <button className='border px-8 py-2 mt-0 mr-8 font-bold rounded-full color-accent-contrast bg-color-accent hover:bg-color-accent-hover'>
        Save
      </button>
    </form>
  )
}
