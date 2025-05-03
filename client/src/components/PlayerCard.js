import { useEffect, useState } from 'react';

const config = require('../config.json');

export default function PlayerCard({ playerId, handleClose }) {
  const [playerData, setPlayerData] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/player/${playerId}`)
      .then(res => res.json())
      .then(data => setPlayerData(data))
      .catch(err => console.error('Error fetching player:', err));
  }, [playerId]);

  if (!playerData) return null;

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>{playerData.first_name} {playerData.last_name}</h2>
        <p><strong>Position:</strong> {playerData.primary_position}</p>
        <p><strong>Nationality:</strong> {playerData.nationality}</p>
        <p><strong>Birth City:</strong> {playerData.birth_city}</p>
        <p><strong>Birth Date:</strong> {new Date(playerData.birth_date).toLocaleDateString()}</p>
        <p><strong>Height:</strong> {playerData.height_cm} cm</p>
        <button onClick={handleClose} style={styles.closeButton}>Close</button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, bottom: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px 30px',
    borderRadius: '8px',
    width: '400px',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  closeButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer'
  }
};
