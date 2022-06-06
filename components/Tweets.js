import Tweet from 'components/Tweet'

// We are going to call each or single tweet using a map() method.
// In return we use <> </> called fragments
// A common pattern in React is for a component to return multiple
// elements. Fragments let you group a list of children without adding
// extra nodes to the DOM.
// As we are calling a tweet(children) in a loop, its better to use
// fragments


export default function Tweets({ tweets, nolink }) {
  if (!tweets) {
    return null
  }

  return(
    <>
        {tweets.map((tweet, index) => (
        <Tweet key={index} tweet={tweet} nolink={nolink} />
        ))}
    </>
  )
}