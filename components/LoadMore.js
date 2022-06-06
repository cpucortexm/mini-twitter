// When we click the button, a GET fetch request to /api/tweets starts, 
// sending 2 query parameters: take and cursor, which contains the id of 
// the last tweet (we get the list of tweets as a prop):
export default function LoadMore({ tweets, setTweets }) {

//  add the new tweets to the list using this simple array trick with the ... spread operator:
  return (
    <div className='mt-10 flex justify-center'>
      <button
        className=' justify-self-center border px-8 py-2 mt-0 mr-2 font-bold rounded-full color-accent-contrast bg-color-accent hover:bg-color-accent-hover '
        onClick={async () => {
          const lastTweetId = tweets[tweets.length - 1].id
          const res = await fetch(`/api/tweets?take=2&cursor=${lastTweetId}`)
          const data = await res.json()
          setTweets([...tweets, ...data])          
        }}
      >
        Load more
      </button>
    </div>
  )
}