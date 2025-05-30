import React, { useState } from "react";
import "./UserProfile.css";
import GameListItem from "./GameListItem";

function UserProfile({ PlayerName, PublishedGames = [] }) {

    return (
        <div id="UserProfile">
            <h1>{PlayerName}</h1>
            <p>Published games:</p>
            {/* Example usage of GameListItem */}
            <GameListItem gameName="Example Game" />
        </div>
    );
}

export default UserProfile;
