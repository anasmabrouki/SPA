const API_BASE_URL = 'https://localhost:7141/api/Flows'; // Adjust the base URL as needed


const  getEnvironments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/environments`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching environments:', error);
      throw error;
    }
  }

const getFlows = async (name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/flows`, {
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
      return data;
    } catch (error) {
      console.error('Error fetching flows:', error);
      throw error;
    }
  }


export { getEnvironments, getFlows } ;
