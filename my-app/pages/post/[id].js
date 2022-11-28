import ReactMarkdown from 'react-markdown'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { css } from '@emotion/css'
import { ethers } from 'ethers'
import { AccountContext } from '../../context'

import {
  OWNER_ADDRESS,
  SMART_CONTRACT_ABI,
  SMART_CONTRACT_ADDRESS,
  QUICKNODE_HTTP_URL,
} from '../../constants'

// const ipfsURI = "https://ipfs.io/ipfs/";
// const ipfsURI = "https://infura-ipfs.io/ipfs/";
const ipfsURI = 'https://himarkblog.infura-ipfs.io/ipfs/'
// Domain ipfs.infura.io isn't active anymore. Use infura-ipfs.io

export default function Post({ post }) {
  const account = useContext(AccountContext)
  const router = useRouter()
  const { id } = router.query

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {post && (
        <div className={container}>
          {
            /* if the owner is the user, render an edit button */
            OWNER_ADDRESS === account && (
              <div className={editPost}>
                <Link href={`/edit-post/${id}`}>Edit post</Link>
              </div>
            )
          }
          {
            /* if the post has a cover image, render it */
            post.coverImage && (
              <img src={post.coverImage} className={coverImageStyle} />
            )
          }
          <h1>{post.title}</h1>
          <div className={contentContainer}>
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}

export async function getStaticPaths() {
  /* here we fetch the posts from the network */
  let provider
  //   if (process.env.ENVIRONMENT === "local") {
  //     provider = new ethers.providers.JsonRpcProvider();
  //   } else if (process.env.ENVIRONMENT === "testnet") {
  provider = new ethers.providers.JsonRpcProvider(
    // "https://rpc-mumbai.matic.today"
    QUICKNODE_HTTP_URL
  )
  //   } else {
  //     provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com/");
  //   }

  const contract = new ethers.Contract(
    SMART_CONTRACT_ADDRESS,
    SMART_CONTRACT_ABI,
    provider
  )
  const data = await contract.fetchPosts()

  /* then we map over the posts and create a params object passing */
  /* the id property to getStaticProps which will run for ever post */
  /* in the array and generate a new page */
  const paths = data.map((d) => ({ params: { id: d[2] } }))

  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps({ params }) {
  /* using the id property passed in through the params object */
  /* we can us it to fetch the data from IPFS and pass the */
  /* post data into the page as props */
  const { id } = params
  const ipfsUrl = `${ipfsURI}${id}`
  const response = await fetch(ipfsUrl)
  console.log('this is the response')
  console.log(response)
  // const data = await response.json();
  const data = await response.json()
  // const data = await response.text();
  console.log('this is the data')
  console.log(data)
  console.log('this is the warning data')
  console.warn(data.responseText)

  if (data.coverImage) {
    let coverImage = `${ipfsURI}${data.coverImage}`
    data.coverImage = coverImage
  }

  return {
    props: {
      post: data,
    },
  }
}

const editPost = css`
  margin: 20px 0px;
`

const coverImageStyle = css`
  width: 900px;
`

const container = css`
  width: 90%;
  height: 100vh;
  margin: 0 auto;
  padding: 20px;
`

const contentContainer = css`
  width: 98%;
  padding: 20px;
  margin-top: 60px;
  padding: 0px 40px;
  border-left: 1px solid #e7e7e7;
  border-right: 1px solid #e7e7e7;
  & img {
    max-width: 900px;
  }
`
