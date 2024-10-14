const API_BASE_URL = 'https://localhost:7141/api/PowerApps'; 

const getApps = async (name) => {
    console.log(name)
    try {
      const response = await fetch(`${API_BASE_URL}/powerApps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body : JSON.stringify(name),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data)
      return data;
    } catch (error) {
      console.error('Error fetching flows:', error);
      throw error;
    }
  }

export {getApps}