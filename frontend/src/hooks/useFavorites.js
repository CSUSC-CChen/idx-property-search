import { useState, useEffect } from 'react';

export function useFavorites() {
    const [favorites, setFavorites] = useState([]);

    // 1. Load favorites from the browser's memory when the app starts
    useEffect(() => {
        const saved = localStorage.getItem('favoriteProperties');
        if (saved) {
            try {
                setFavorites(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse favorites", e);
            }
        }
    }, []);

    // 2. The function to add or remove a favorite
    const toggleFavorite = (propertyId) => {
        let newFavorites;
        if (favorites.includes(propertyId)) {
            // Remove if already there
            newFavorites = favorites.filter(id => id !== propertyId);
        } else {
            // Add if not there
            newFavorites = [...favorites, propertyId];
        }

        setFavorites(newFavorites);
        // Save to browser memory so it persists after refresh
        localStorage.setItem('favoriteProperties', JSON.stringify(newFavorites));
    };

    // 3. Helper to check if a specific house is hearted
    const isFavorite = (propertyId) => favorites.includes(propertyId);

    return { favorites, toggleFavorite, isFavorite };
}