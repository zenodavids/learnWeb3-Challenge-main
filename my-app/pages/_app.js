import '../styles/globals.css'
import { useState } from 'react'
import Link from 'next/link'
import { css } from '@emotion/css'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { AccountContext } from '../context.js'
import { OWNER_ADDRESS } from '../constants'
import 'easymde/dist/easymde.min.css'
import { GiWallet } from 'react-icons/gi'
import { SiWebmoney } from 'react-icons/si'

function MyApp({ Component, pageProps }) {
  /* create local state to save account information after signin */
  const [account, setAccount] = useState(null)
  /* web3Modal configuration for enabling wallet access */
  async function getWeb3Modal() {
    const web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: '7db3a1b57c0646f09a470e804f7fb9e8',
          },
        },
      },
    })
    return web3Modal
  }

  /* the connect function uses web3 modal to connect to the user's wallet */
  const connect = async () => {
    try {
      const web3Modal = await getWeb3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const accounts = await provider.listAccounts()
      setAccount(accounts[0])
    } catch (err) {
      console.log('error:', err)
    }
  }

  return (
    <div>
      <nav className='nav'>
        <div className='header'>
          <Link className='logo' href='/'>
            {<SiWebmoney />}
            {/* <img src='/logo.svg' alt='React Logo' style={{ width: "50px" }} /> */}
          </Link>
          <Link href='/'>
            <div className='titleContainer'>
              <h2 className='title'>Web3 Magazine</h2>
              <p className='description'>GRANDIDA</p>
            </div>
          </Link>
          {/* <Link href='/' className='link'>blog</Link> */}

          <div className='buttonContainer'>
            {/* ////////////////////////// */}
            {
              //  if the signed in user is the contract owner, we
              //  show the nav link to create a new post
              account === OWNER_ADDRESS && (
                <Link href='/create-post' className='link'>
                  Create Post
                </Link>
              )
            }
            {/* ////////////////////////// */}
            {!account && (
              <button className='buttonStyle' onClick={connect}>
                {<GiWallet />} Connect
              </button>
            )}
          </div>

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
            <li className='tickerItem'>
              HIMARK TO INTRODUCE NFTS {<SiWebmoney />}
            </li>
            <li className='tickerItem'>
              GRANDIDA TO PAY tier 1 {<SiWebmoney />}
            </li>
            <li className='tickerItem'>
              tier 2 to move to tier 1 {<SiWebmoney />}
            </li>
            <li className='tickerItem'>
              WEB3 GURUS nominated as best group {<SiWebmoney />}
            </li>
            <li className='tickerItem'>
              Mr Ademola to win best manager of the year {<SiWebmoney />}
            </li>
            <li className='tickerItem'>
              BEE AND SOPHIE TAKEN TO COURT FOR NOT GIVING ZEE FOOD ON TIME{' '}
              {<SiWebmoney />}
            </li>
          </ul>
        </div>
        {/* End of newsTicker */}
      </nav>
      <div className='container'>
        <AccountContext.Provider value={account}>
          <Component {...pageProps} />
        </AccountContext.Provider>{' '}
      </div>
    </div>
  )
}

export default MyApp
