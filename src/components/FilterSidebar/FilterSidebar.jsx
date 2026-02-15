import React, { useState, useEffect } from 'react';
import styles from './FilterSidebar.module.css';

const FilterSidebar = ({
    filters,
    appliedFilters,
    onFilterChange,
    onClearFilters
}) => {
    const [localPriceRange, setLocalPriceRange] = useState({
        min: appliedFilters.minPrice || '',
        max: appliedFilters.maxPrice || ''
    });
    console.log('appliedFilters', appliedFilters)

    const [localRating, setLocalRating] = useState(appliedFilters.minRating || '');

    useEffect(() => {
        setLocalPriceRange({
            min: appliedFilters.minPrice || '',
            max: appliedFilters.maxPrice || ''
        });
        setLocalRating(appliedFilters.minRating || '');
    }, [appliedFilters]);

    const handleMinPriceChange = (e) => {
        const value = e.target.value;
        setLocalPriceRange(prev => ({ ...prev, min: value }));

        onFilterChange('minPrice', value);
    };

    const handleMaxPriceChange = (e) => {
        const value = e.target.value;
        setLocalPriceRange(prev => ({ ...prev, max: value }));

        onFilterChange('maxPrice', value);
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        onFilterChange('category', value);
    };

    const handleBrandChange = (e) => {
        const value = e.target.value;
        onFilterChange('brand', value);
    };

    const handleRatingChange = (e) => {
        const value = e.target.value;
        setLocalRating(value);

        if (value === '' || (value >= 1 && value <= 5)) {
            onFilterChange('minRating', value);
        }
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles.header}>
                <h2 className={styles.title}>Filters</h2>
                {Object.entries(appliedFilters).length > 1 && 
                    <button
                        className={styles.clearButton}
                        onClick={onClearFilters}
                        disabled={Object.entries(appliedFilters).length === 0}
                    >
                        Clear All
                    </button>
                }
            </div>

            {filters.categories && filters.categories.length > 0 && (
                <div className={styles.filterSection}>
                    <h3 className={styles.filterTitle}>Category</h3>
                    <select
                        className={styles.select}
                        value={appliedFilters.category || ''}
                        onChange={handleCategoryChange}
                    >
                        <option value="">All Categories</option>
                        {filters.categories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {filters.brands && filters.brands.length > 0 && (
                <div className={styles.filterSection}>
                    <h3 className={styles.filterTitle}>Brand</h3>
                    <select
                        className={styles.select}
                        value={appliedFilters.brand || ''}
                        onChange={handleBrandChange}
                    >
                        <option value="">All Brands</option>
                        {filters.brands.map(brand => (
                            <option key={brand} value={brand}>
                                {brand}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>Price Range ($)</h3>
                <div className={styles.priceInputs}>
                    <div className={styles.priceInput}>
                        <label htmlFor="minPrice">Min</label>
                        <input
                            id="minPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            value={localPriceRange.min}
                            onChange={handleMinPriceChange}
                            placeholder="0"
                            className={styles.priceField}
                        />
                    </div>
                    <div className={styles.priceInput}>
                        <label htmlFor="maxPrice">Max</label>
                        <input
                            id="maxPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            value={localPriceRange.max}
                            onChange={handleMaxPriceChange}
                            placeholder="Any"
                            className={styles.priceField}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>Minimum Rating</h3>
                <div className={styles.ratingInput}>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        step="0.5"
                        value={localRating}
                        onChange={handleRatingChange}
                        placeholder="1-5"
                        className={styles.ratingField}
                    />
                    <span className={styles.ratingHint}>stars (1-5)</span>
                </div>
                {localRating && localRating >= 1 && localRating <= 5 && (
                    <div className={styles.ratingPreview}>
                        {'★'.repeat(Math.floor(parseFloat(localRating)))}
                        {parseFloat(localRating) % 1 !== 0 && '½'}
                        {'☆'.repeat(5 - Math.ceil(parseFloat(localRating)))}
                    </div>
                )}
                {(localRating && (localRating < 1 || localRating > 5)) && (
                    <div className={styles.ratingError}>
                        Please enter a value between 1 and 5
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterSidebar;