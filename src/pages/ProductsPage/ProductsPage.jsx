import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar';
import Pagination from '../../components/Pagination/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { useProducts } from '../../hooks/useProducts';
import styles from './ProductsPage.module.css';

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { products, filters, loading, error, pagination, fetchProducts } = useProducts();

    const getFiltersFromUrl = useCallback(() => {
        const params = {};
        for (const [key, value] of searchParams.entries()) {
            if (value && value !== '') {
                params[key] = value;
            }
        }
        return params;
    }, [searchParams]);

    const [appliedFilters, setAppliedFilters] = useState(getFiltersFromUrl());
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const updateUrlParams = useCallback((filters) => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value);
            }
        });

        params.append('page', filters.page || 1);

        setSearchParams(params, { replace: true });
    }, [setSearchParams]);

    useEffect(() => {
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;

        const filtersFromUrl = {};
        searchParams.forEach((value, key) => {
            if (key !== 'page' && key !== 'limit') {
                filtersFromUrl[key] = value;
            }
        });

        setAppliedFilters(filtersFromUrl);

        if (fetchProducts) {
            fetchProducts({
                page,
                limit,
                ...filtersFromUrl
            }).finally(() => {
                setIsInitialLoad(false);
            });
        }
    }, []);

    useEffect(() => {
        if (isInitialLoad || !fetchProducts) return;

        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;

        fetchProducts({
            page,
            limit,
            ...appliedFilters
        });
    }, [appliedFilters, searchParams, isInitialLoad, fetchProducts]);

    const handleFilterChange = useCallback((key, value) => {
        setAppliedFilters(prev => {
            const newFilters = { ...prev };

            if (value === '' || value === null || value === undefined) {
                delete newFilters[key];
            } else {
                newFilters[key] = value;
            }

            newFilters.page = 1;

            updateUrlParams(newFilters);

            return newFilters;
        });
    }, [updateUrlParams]);

    const handlePageChange = useCallback((newPage) => {
        setAppliedFilters(prev => {
            const newFilters = { ...prev, page: newPage };
            updateUrlParams(newFilters);
            return newFilters;
        });
    }, [updateUrlParams]);

    const clearAllFilters = useCallback(() => {
        setAppliedFilters({ page: 1 });
        updateUrlParams({ page: 1 });
    }, [updateUrlParams]);

    if (error) {
        return (
            <div className={styles.error}>
                <h2>Oops! Something went wrong</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <FilterSidebar
                    filters={filters}
                    appliedFilters={appliedFilters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={clearAllFilters}
                />
            </div>

            <div className={styles.main}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>Products</h1>
                        {loading && <span className={styles.loadingIndicator}>Updating...</span>}
                    </div>

                    <div className={styles.headerRight}>
                        <p className={styles.results}>
                            Showing {products.length} of {pagination.total} products
                        </p>
                    </div>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        {products.length === 0 ? (
                            <div className={styles.noResults}>
                                <p>No products found matching your criteria.</p>
                                <button
                                    className={styles.clearFiltersButton}
                                    onClick={clearAllFilters}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className={styles.productGrid}>
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}

                        {pagination.totalPages > 1 && (
                            <Pagination
                                currentPage={parseInt(searchParams.get('page')) || 1}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;