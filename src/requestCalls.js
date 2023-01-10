
async function getResponse(query, variables={}) {
    const response = await fetch("http://localhost:5000/graphql", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    });
    const result = await response.json();
    return result;
}

export default getResponse;