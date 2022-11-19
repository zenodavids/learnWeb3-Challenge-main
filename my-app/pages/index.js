import { css } from "@emotion/css";
import { useContext } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Link from "next/link";
import { AccountContext } from "../context";
import "../styles/Home.module.css"
import { MdArticle } from "react-icons/md";
import { TiArrowRightThick } from "react-icons/ti";



import {
  OWNER_ADDRESS,
  SMART_CONTRACT_ABI,
  SMART_CONTRACT_ADDRESS,
  QUICKNODE_HTTP_URL,
} from "../constants";

export default function Home(props) {
  /* posts are fetched server side and passed in as props */
  /* see getServerSideProps */
  const { posts } = props;
  const account = useContext(AccountContext);

  const router = useRouter();
  async function navigate() {
    router.push("/create-post");
  }

  return (
    <div>
      <div className={postList}>
        {
          // map over the posts array and render a button with the post title
          posts.map((post, index) => (
            <Link href={`post/${post[2]}`} key={index}>
              <div className={linkStyle}>
                <p className={postTitle}>
                  {<MdArticle />} {post[1].slice(0, 20)}
                </p>

                <div className={arrowContainer}>
                  <span style={{ fontSize: "16px" }}> ...Read more.</span>
                  {<TiArrowRightThick />}
                </div>
              </div>
            </Link>
          ))
        }
      </div>
      <div className={container}>
        {account === OWNER_ADDRESS && posts && !posts.length && (
          //  if the signed in user is the account owner, render a button
          //  to create the first post
          <button className={buttonStyle} onClick={navigate}>
            Create your first post {<TiArrowRightThick />}
          </button>
        )}
      </div>
    </div>
  );
}

/////////////////////////////////
export async function getServerSideProps() {
  /* here we check to see the current environment variable */
  /* and render a provider based on the environment we're in */
  let provider;
  // if (process.env.MAINET_ENVIRONMENT === "mainet") {
  //   provider = new ethers.providers.JsonRpcProvider();
  // } else if (process.env.TESTNET_ENVIRONMENT === "testnet") {
  provider = new ethers.providers.JsonRpcProvider(
    // "https://rpc-mumbai.matic.today"
    QUICKNODE_HTTP_URL
  );
  // } else {
  //   provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com/");
  // }

  // If user is not connected to the Goerli network, let them know and throw an error
  // const { chainId } = await web3Provider.getNetwork();
  // if (chainId !== 1 || chainId !== 137 || chainId !== 80001) {
  //   alert("Change wallet network to Ethereum, Polygon or Mumbai Testnet");
  //   throw new Error(
  //     "Change wallet network to Ethereum, Polygon or Mumbai Testnet"
  //   );
  // }

  //   //////////////////////////////////////////////////////
  const contract = new ethers.Contract(
    SMART_CONTRACT_ADDRESS,
    SMART_CONTRACT_ABI,
    provider
  );
  const data = await contract.fetchPosts();
  return {
    props: {
      posts: JSON.parse(JSON.stringify(data)),
    },
  };
}
/////////////////////////////////

const arrowContainer = css`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  padding-right: 20px;
  padding-top: 30px;
  color: #fff;
  font-size: 1.5rem;

`;

const postTitle = css`
  border-left: 7px solid transparent;
  border-image: linear-gradient(#fad6a5, #cfb997, #8b7e74, #9ba17b, #fad6a5) 1;
  font-size: 30px;
  text-transform: capitalize;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: bold;
  cursor: pointer;
  color: #fff;
  margin: 0;
  padding: 20px;
  text-decoration: none;
`;

const linkStyle = css`
  border-left: 7px solid transparent;
  border-image: linear-gradient(#fad6a5, #cfb997, #8b7e74, #9ba17b, #fad6a5) 1;
  margin-top: 20px;
  border-radius: 8px;
  display: flex;

`;

const postList = css`
  width: 700px;
  margin: 0 auto;
  padding-top: 50px;
`;

const container = css`
  display: flex;
  justify-content: center;
`;

const buttonStyle = css`
  margin-top: 100px;
  background-color: #fafafa;
  outline: none;
  border: none;
  font-size: 44px;
  padding: 20px 70px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 7px 7px rgba(0, 0, 0, 0.1);
`;

const arrow = css`
  width: 35px;
  margin-left: 30px;
`;

const smallArrow = css`
  width: 25px;
`;
