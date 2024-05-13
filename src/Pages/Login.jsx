import { Button, Flex } from '@chakra-ui/react';
import React, { useState } from 'react';

const MetamaskLogin = () => {
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const connectToMetamask = async () => {
    try {
      setLoading(true);
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        // Request access to user's MetaMask accounts
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setLoggedIn(true);
        localStorage.setItem("isAuth", "true");
      } else {
        setError('MetaMask is not installed');
      }
    } catch (error) {
      console.error(error);
      setError('Failed to connect to MetaMask');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex alignItems={"center"} justifyContent={"center"} w="100vh" h="70vh">
      {loggedIn ? (
        <p>You are logged in with MetaMask!</p>
      ) : (
        <Button onClick={connectToMetamask} disabled={loading}>
          {loading ? 'Connecting...' : 'Connect with MetaMask'}
        </Button>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </Flex>
  );
};

export default MetamaskLogin;