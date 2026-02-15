import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const filterData = await api.getFilters();
                setFilters(filterData);
            } catch (err) {
                console.error('Error fetching filters:', err);
                setError('Failed to load filters: ' + err.message);
            }
        };
        fetchFilters();
    }, []);

    const fetchProducts = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.getProducts(params);

            if (response && response.data && Array.isArray(response.data)) {
                setProducts(response.data);

                if (response.pagination) {
                    setPagination({
                        page: response.pagination.page || 1,
                        limit: response.pagination.limit || 10,
                        total: response.pagination.total || 0,
                        totalPages: response.pagination.totalPages || Math.ceil((response.pagination.total || 0) / (response.pagination.limit || 10))
                    });
                } else {
                    setPagination({
                        page: params.page || 1,
                        limit: params.limit || 10,
                        total: response.data.length,
                        totalPages: 1
                    });
                }
            } else {
                console.error('Unexpected API response structure:', response);
                setError('Invalid API response format');
                setProducts([]);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err.message);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        products,
        filters,
        loading,
        error,
        pagination,
        fetchProducts
    };
};