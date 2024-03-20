async function fetchLobbies() {
    try {
        const response = await fetch('/api/lobby');
        if (!response.ok) {
            throw new Error('Failed to fetch lobbies');
        }
        const lobbies = await response.json();

        // Extracting names and IDs from lobbies
        return lobbies.map(lobby => ({
            id: lobby.id,
            name: lobby.lobby_name
        }));

    } catch (error) {
        console.error('Error fetching lobbies:', error);
        return [];
    }
}

const createLobby = () => {
    //This Function creates the lobby when a name is inserted
    //and the user presses the create button
    const lobby_name = document.getElementById("lobby-text-box").value;
    const lobbyData = {
        lobby_name: lobby_name,
        uid: "1"    //REPLACE WITH UID OF USER WHO CREATED IT
    }

    fetch('/api/lobby', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(lobbyData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create lobby');
            }
            console.log('Lobby Created')
        })
        .catch(error => {
            console.error('Error creating lobby', error);
        })
}

const logout = () => {
    //This function is run when logout button is pressed
    const del ={method: "POST"}
    const delReq = new Request("../logout")
    fetch(delReq, del).then((response) => {})
}

const editLobby = () => {

}

const deleteLobby = (lobbyID) => {
    fetch(`/api/lobby/${lobbyId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete lobby');
            }
            console.log('Lobby deleted successfully');
        })
        .catch(error => {
            console.error('Error deleting lobby:', error);
        });
}