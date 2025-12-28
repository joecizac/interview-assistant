export const api = {
  load: async () => {
    try {
      const res = await fetch('/api/store');
      if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
      }
      return await res.json();
    } catch (error) {
      console.error('Failed to load data:', error);
      throw error;
    }
  },

  save: async (data: any) => {
    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
      }
      return await res.json();
    } catch (error) {
      console.error('Failed to save data:', error);
      throw error;
    }
  },
};
