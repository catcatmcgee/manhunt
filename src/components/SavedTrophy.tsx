import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas } from 'react-three-fiber';
import { Box, Dodecahedron, Torus } from '@react-three/drei';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

type TrophyData = {
  dimension: number;
  color: string;
  shape: string;
  tubularSegments: number;
  tubeWidth: number;
};

export type UserData = {
  id: number;
  username: string;
  email: string;
  authId: string;
  gamesPlayed: number;
  gamesWon: number;
  killsConfirmed: number;
  facialDescriptions: Array<number> | null;
  // Add other user data properties as needed
};

const SavedTrophy: React.FC<TrophyData> = () => {
  const trophyRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [prevMouseX, setPrevMouseX] = useState(0);
  const [prevMouseY, setPrevMouseY] = useState(0);
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userTrophyData, setUserTrophyData] = useState<TrophyData[]>([]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get<UserData>(`/Users/${user?.sub}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserTrophyData = async () => {
    try {
      if (userData) {
        const response = await axios.get<{ generationConditions: string }[]>(
          `/trophies/${userData.id}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        const parsedTrophyData: TrophyData[] = response.data.map((trophy) => {
          const generationConditions = JSON.parse(trophy.generationConditions);
          return {
            dimension: generationConditions.dimension,
            color: generationConditions.color,
            shape: generationConditions.shape,
            tubularSegments: generationConditions.tubularSegments,
            tubeWidth: generationConditions.tubeWidth,
          };
        });
        setUserTrophyData(parsedTrophyData);
      }
    } catch (error) {
      console.error('Error fetching user trophy data:', error);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDragging(true);
    setPrevMouseX(e.clientX);
    setPrevMouseY(e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isDragging) return;

    const mouseDeltaX = e.clientX - prevMouseX;
    const mouseDeltaY = e.clientY - prevMouseY;
    setPrevMouseX(e.clientX);
    setPrevMouseY(e.clientY);

    if (trophyRef.current) {
      trophyRef.current.rotation.y += mouseDeltaX * 0.01; // Rotate around Y-axis
      trophyRef.current.rotation.x += mouseDeltaY * 0.01; // Rotate around X-axis
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []); // Fetch user data only once on component mount

  useEffect(() => {
    if (userData) {
      fetchUserTrophyData();
    }
  }, [userData]);

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <h1>Your most recent Trophies </h1>
      {true ? (
        userTrophyData.map((trophy, index) => (
          <div key={index}>
            <div>
              <h1>You win this!</h1>
              <Canvas>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                {trophy.shape === 'box' && (
                  <Box
                    ref={trophyRef}
                    args={[
                      trophy.dimension,
                      trophy.dimension,
                      trophy.dimension,
                    ]}
                    position={[0, 0, 0]}
                    rotation={[0, 0.4, 0]}
                  >
                    <meshStandardMaterial
                      attach='material'
                      color={trophy.color}
                    />
                  </Box>
                )}
                {trophy.shape === 'polyhedron' && (
                  <Dodecahedron
                    ref={trophyRef}
                    args={[trophy.dimension, 0]}
                    position={[0, 0, 0]}
                    rotation={[0, 0.4, 0]}
                  >
                    <meshStandardMaterial
                      attach='material'
                      color={trophy.color}
                    />
                  </Dodecahedron>
                )}
                {trophy.shape === 'torus' && (
                  <Torus
                    ref={trophyRef}
                    args={[
                      trophy.dimension,
                      trophy.tubeWidth,
                      16,
                      trophy.tubularSegments,
                    ]}
                    position={[0, 0, 0]}
                    rotation={[0, 0.4, 0]}
                  >
                    <meshStandardMaterial
                      attach='material'
                      color={trophy.color}
                    />
                  </Torus>
                )}
              </Canvas>
              <button> just do it </button>
            </div>
            <h6>Dimension: {trophy.dimension}</h6>
            <h6>Color: {trophy.color}</h6>
            <h6>Shape: {trophy.shape}</h6>
            <h6>Tubular Segments: {trophy.tubularSegments}</h6>
            <h6>Tube Width: {trophy.tubeWidth}</h6>
          </div>
        ))
      ) : (
        <p>Loading trophy data...</p>
      )}
    </div>
  );
};

export default SavedTrophy;
