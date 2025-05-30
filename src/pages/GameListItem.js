import "./GameListItem.css";

function GameListItem({ gameName }) {
    return (
        <div className="game-list-item">
            <h2>{gameName}</h2>
            <div className="button-group">
                <div className="edit-button">Edit</div>
                <div className="delete-button">Delete</div>
                
            </div>
        </div>
    );
}

export default GameListItem;