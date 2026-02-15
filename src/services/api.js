const API_BASE_URL = 'http://localhost:3001';
const defaultPage = 1;
const defaultLimit = 10;

export const api = {
    async getProducts(params = {}) {
        const queryParams = new URLSearchParams();

        queryParams.append('page', params.page || defaultPage);
        queryParams.append('limit', params.limit || defaultLimit);

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                if (key !== 'page' && key !== 'limit') {
                    queryParams.append(key, value);
                }
            }
        });

        const url = `${API_BASE_URL}/products?${queryParams}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    },

    async getFilters() {
        const url = `${API_BASE_URL}/filters`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch filters:', error);
            throw error;
        }
    }
};