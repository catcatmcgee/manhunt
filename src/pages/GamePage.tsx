
import React, { useState, useContext, useEffect, } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import SocketContext from '../contexts/Socket/SocketContext';
import { WebcamProvider } from '../contexts/WebcamProvider'
import { WebcamChaseProvider } from '../contexts/WebcamChaseProvider';
import ChaseCam from '../components/ChaseCam';
import KillCam from '../components/KillCam';
import Countdown from '../components/Countdown';
import { Container } from '../styles/Container';
import { GameHeader, Footer } from '../styles/Header';
import { Main } from '../styles/Main';
import {Crosshair , Eye } from 'react-feather';

const GamePage: React.FC = () => {

  // which component do we render? kill or chase?
  const [gameMode, setGameMode] = useState<string>('Chase');
  const { games } = useContext(SocketContext).SocketState;
  const { Redirect } = useContext(SocketContext);

  // checks to see if the user should be redirected if the game doesn't exist
  const location = useLocation();
  const currentEndpoint = location.pathname;
  useEffect(() => {
    Redirect(currentEndpoint);
  }, [games]);


  const handleGameChange = () => {
    if (gameMode === 'Chase') {
      setGameMode('Kill')
    } else {
      setGameMode('Chase')
    }
  }

  return (
    <Container>
      <GameHeader>
        <Countdown />
      </GameHeader>
      <Main>
        {gameMode === 'Chase' ? (
          <WebcamChaseProvider key="chaseCam">
            <ChaseCam />
          </WebcamChaseProvider>
        ) : (
          <WebcamProvider key="killCam">
            <KillCam />
          </WebcamProvider>
        )}
      </Main>
      <Footer style={{ display: 'flex', justifyContent: 'end' }}>
        {gameMode === 'Chase'
          ? <Crosshair className='react-icon-large' onClick={handleGameChange} />
          : <Eye className='react-icon-large' onClick={handleGameChange} />}
      </Footer>
    </Container>
  );
}

export default GamePage;
