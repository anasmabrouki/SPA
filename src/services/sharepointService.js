const API_BASE_URL = 'https://localhost:7141/api/Sharepoint'; // Adjust the base URL as needed

const getSharepointSites = async (jwt) => {
    try {
        const response = await fetch(`${API_BASE_URL}/sites`, {
            method: 'GET',
            headers: {
                'jwt': jwt
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching SharePoint sites:', error);
        throw error;
    }
};

const getSharepointLists = async (jwt, siteId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/sites/${siteId}/lists`, {
            method: 'GET',
            headers: {
                'jwt': jwt
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await parseResponse(response);
    } catch (error) {
        console.error('Error fetching SharePoint lists:', error);
        throw error;
    }
};

const migrateSharepointLists = async (sourceJwt, targetJwt, sourceSiteId, targetSiteId, listGuids) => {
    const migrationPayload = {
        sourceSiteId,
        targetSiteId,
        listGuids
    };
    try {
        const response = await fetch(`${API_BASE_URL}/migrate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'sourceJwt': sourceJwt,
                'targetJwt': targetJwt
            },
            body: JSON.stringify(migrationPayload)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Migration successful:', data);
    } catch (error) {
        console.error('Error during migration:', error);
    }
};

const parseResponse = async (response) => {
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let result = '';
    let done = false;

    while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        result += decoder.decode(value, { stream: true });
    }

    return JSON.parse(result);
};

export { getSharepointSites, getSharepointLists, migrateSharepointLists };
