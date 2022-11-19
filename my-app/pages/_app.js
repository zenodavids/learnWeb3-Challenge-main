import "../styles/globals.css";
import { useState } from "react";
import Link from "next/link";
import { css } from "@emotion/css";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { AccountContext } from "../context.js";
import { OWNER_ADDRESS } from "../constants";
import "easymde/dist/easymde.min.css";
import { GiWallet } from "react-icons/gi";
import { SiWebmoney } from "react-icons/si";

function MyApp({ Component, pageProps }) {
  /* create local state to save account information after signin */
  const [account, setAccount] = useState(null);
  /* web3Modal configuration for enabling wallet access */
  async function getWeb3Modal() {
    const web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: "7db3a1b57c0646f09a470e804f7fb9e8",
          },
        },
      },
    });
    return web3Modal;
  }

  /* the connect function uses web3 modal to connect to the user's wallet */
  const connect = async () => {
    try {
      const web3Modal = await getWeb3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const accounts = await provider.listAccounts();
      setAccount(accounts[0]);
    } catch (err) {
      console.log("error:", err);
    }
  };

  return (
    <div>
      <nav className='nav'>
        <div className='header'>
          <Link className="logo" href='/'>
            {<SiWebmoney/>}
            {/* <img src='/logo.svg' alt='React Logo' style={{ width: "50px" }} /> */}
          </Link>
          <Link href='/'>
            <div className='titleContainer'>
              <h2 className='title'>Web3 Blog</h2>
              <p className='description'>Home</p>
            </div>
          </Link>
          {/* <Link href='/' className='link'>blog</Link> */}
          {
            //  if the signed in user is the contract owner, we
            //  show the nav link to create a new post
            account === OWNER_ADDRESS && (
              <Link href='/create-post' className='link'>
                Create Post
              </Link>
            )
          }
          {!account && (
            <div className='buttonContainer'>
              <button className='buttonStyle' onClick={connect}>
                {<GiWallet/> } Connect
              </button>
            </div>
          )}

          {account && (
            <p className='accountInfo'>{`${account.slice(
              0,
              4
            )}...${account.slice(38)}`}</p>
          )}
        </div>
        {/*  newsTicker */}
        <div id='ticker'>
          <div className='title'>NEWS</div>
          <ul>
            <li className='tickerItem'>HIMARK TO INTRODUCE NFTS  {<SiWebmoney/>}</li>
            <li className='tickerItem'>
              GRANDIDA SET TO PAY FIRST SET OF EMPLOYEES  {<SiWebmoney/>}
            </li>
            <li className='tickerItem'>
              WEB3 GURUS SET TO OVERTAKE THE WEB3 BUSINESS  {<SiWebmoney/>}
            </li>
            <li className='tickerItem'>Ademola to win best manager of the year  {<SiWebmoney/>}</li>
            <li className='tickerItem'>BEE AND SOPHIE TAKEN TO COURT FOR NOT GIVING ZEE FOOD ON TIME  {<SiWebmoney/>}</li>
          </ul>
        </div>
        {/* End of newsTicker */}
      </nav>
      <div className='container'>
        <AccountContext.Provider value={account}>
          <Component {...pageProps} />
        </AccountContext.Provider>
      </div>
    </div>
  );
}

const accountInfo = css`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: flex-end;
  font-size: 12px;
`;

const container = css`
  padding: 40px;
`;

const linkContainer = css`
  padding: 30px 60px;
  background-color: #fafafa;
`;

const nav = css`
  background-color: white;
`;

const header = css`
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.075);
  padding: 20px 30px;
`;

const description = css`
  margin: 0;
  color: #999999;
`;

const titleContainer = css`
  display: flex;
  flex-direction: column;
  padding-left: 15px;
`;

const title = css`
  margin-left: 30px;
  font-weight: 500;
  margin: 0;
`;

const buttonContainer = css`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

const buttonStyle = css`
  background-color: #fafafa;
  outline: none;
  border: none;
  font-size: 18px;
  padding: 16px 70px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 7px 7px rgba(0, 0, 0, 0.1);
`;

const link = css`
  margin: 0px 40px 0px 0px;
  font-size: 16px;
  font-weight: 400;
`;


export default MyApp;
