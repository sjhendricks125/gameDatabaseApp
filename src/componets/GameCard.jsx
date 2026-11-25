import React from 'react'
import './gameCard.css'

const GameCard = ({ game }) => {
  return (
    <div className="game-card">
            <h1>
                {game.name} 
            </h1>
            <img src={game.background_image} alt={game.name}/>
            <h3>Released: {game.released}</h3>
            <h3>Rating: {game.rating}</h3>
        </div>
  )
} 

export default GameCard
