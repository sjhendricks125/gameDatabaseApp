import React, { useState, useEffect } from "react";
import GameCard from "./GameCard";
import './gameCard.css'


const API_URL = `https://api.rawg.io/api/games?key=${import.meta.env.VITE_APP_ID}`;
const GENRES = ["All", "Action", "Adventure", "RPG", "Shooter", "Indie", "Puzzle"];

const Games = () => {
    // useState has initial state of empty array
    const [games, setGames] = useState([]);

    // State for the search box and the search result
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("All");
    const [foundGames, setFoundGames] = useState([]);
    const [message, setMessage] = useState("");

    // Fetch Initial games
    const fetchInitialGames = async () => {
        try {
            const randomPage = Math.floor(Math.random() * 10) + 1; //random page between 1 and 10 so it isn't the same games every time 
            const response = await fetch(`${API_URL}&page=${randomPage}`);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                setGames(data.results);
            }
        } catch (error) {
            console.log(`Error: ${error}`);
            setMessage("Failed to fetch games.");
        }
    };

    //Fetch games on load 
    useEffect(() => {
        fetchInitialGames();
    }, []);

    // Fetch from the API again and look for a game by name
    const searchGame = async () => {
        const term = searchTerm.trim().toLowerCase();

        if (term === "") {
            setFoundGames([]);
            setMessage("Please type a game name to search for.");
            return;
        }

        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            // Keep only games whose name contains the search term
            const matches = data.results.filter((game) => {
                const gameName = `${game.name}`.toLowerCase();
                return gameName.includes(term);
            });

            setFoundGames(matches);

            if (matches.length === 0) {
                setMessage(`No game with name: "${searchTerm}" found.`);
            } else {
                setMessage("");
            }
        } catch (error) {
            console.log(`Error: ${error}`);
            setMessage("Something went wrong. Please try again.");
        };
    };

    const filterByGenre = (game) => {
        if (selectedGenre === "All") return true;
        return game.genres.some((genre) => genre.name === selectedGenre);
    };

    return (
        <div className="games">
            <h1>RAWG Video Game Database</h1>
            {/* Search box and second button */}
            <div className="search">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={searchGame}>Search</button>
            </div>
            <div className="filters">
                {GENRES.map((genre) => ( //maybe try not map?
                    <button
                        key={genre}
                        className={selectedGenre === genre ? "active" : ""}
                        onClick={() => setSelectedGenre(genre)} > {genre}
                    </button>
                ))}
            </div>
            {/* Search result, or a "not found" message */}
            {message && <p className="message">{message}</p>}

            {foundGames.length > 0 && (
                <div>
                    <h2>Search Result</h2>
                    <div className="game-list">
                        {foundGames.map((game) => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </div>
                </div>
            )}

            {/* All 20 games */}
            {games.length > 0 && (
                <div>
                    <h2>{selectedGenre} Games ({games.filter(filterByGenre).length})</h2>
                    <div className="game-list">
                        {games.filter(filterByGenre).map((game) => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Games;
