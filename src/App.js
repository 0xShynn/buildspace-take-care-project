import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_QUOTESS = [
  'https://i.ibb.co/z2m4j94/Image-about-quotes-in-w-o-r-d-s-by-i-m-p-e-r-f-e-c-t-i-o-n.png',
  'https://i.ibb.co/888FWnC/image.png',
  'https://i.ibb.co/n1fKrTP/image.jpg',
  'https://i.ibb.co/Y2wmC9N/alishalopez.jpg',
  'https://i.ibb.co/0rbsMmJ/Malorie-on-Twitter.jpg',
  'https://i.ibb.co/nQf3rfS/Minimal-Classy.jpg',
];

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [quoteList, setQuoteList] = useState([]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');

          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const sendQuote = async () => {
    if (inputValue.length > 0) {
      console.log('Quote link:', inputValue);
    } else {
      console.log('Empty input. Try again.');
    }
  };

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendQuote();
        }}
      >
        <input
          type="text"
          placeholder="Enter quote link!"
          value={inputValue}
          onChange={onInputChange}
        />
        <button type="submit" className="cta-button submit-quote-button">
          Submit
        </button>
      </form>

      <div className="quote-grid">
        {quoteList.map((quote) => (
          <div className="quote-item" key={quote}>
            <img src={quote} alt={quote} />
          </div>
        ))}
      </div>
    </div>
  );

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching Quote list...');
      setQuoteList(TEST_QUOTESS);
    }
  }, [walletAddress]);

  return (
    <div className="App">
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="container">
          <div className="header-container">
            <p className="header">Take Care Project 💛</p>
            <p className="sub-text">
              Inspirational quotes from the metaverse ✨
            </p>
            {!walletAddress && renderNotConnectedContainer()}
            {walletAddress && renderConnectedContainer()}
          </div>
          <div className="footer-container">
            <img
              alt="Twitter Logo"
              className="twitter-logo"
              src={twitterLogo}
            />
            <a
              className="footer-text"
              href={TWITTER_LINK}
              target="_blank"
              rel="noreferrer"
            >{`built on @${TWITTER_HANDLE}`}</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
