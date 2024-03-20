async function fetchLobbies() {
    try {
        const response = await fetch('/api/lobby');
        if (!response.ok) {
            throw new Error('Failed to fetch lobbies');
        }
        const lobbies = await response.json();

        // Extracting names and IDs from lobbies
        const lobbiesInfo = lobbies.map(lobby => ({
            id: lobby.id,
            name: lobby.lobby_name
        }));

        return lobbiesInfo;
    } catch (error) {
        console.error('Error fetching lobbies:', error);
        return [];
    }
}

const createLobby = () => {
    //This Function creates the lobby when a name is inserted
    //and the user presses the create button
    const lobby_name = document.getElementById("lobby-text-box").value
}

const logout = () => {
    //This function is run when logout button is pressed
    const del ={method: "POST"}
    const delReq = new Request("../logout")
    fetch(delReq, del).then((response) => {})
}

const editLobby = () => {

}

const deleteLobby = () => {

}