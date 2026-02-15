import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
    const {
        name = 'Unnamed Product',
        brand = 'Unknown Brand',
        category = 'Uncategorized',
        price = 0,
        rating = 0,
        imageUrl = 'https://via.placeholder.com/300x200?text=No+Image'
    } = product;

    const renderStars = (rating) => {
        const fullStars = Math.round(rating);
        return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
    };

    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <img
                    src={imageUrl}
                    alt={name}
                    className={styles.image}
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                    }}
                />
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{name}</h3>

                <div className={styles.brandRow}>
                    <span className={styles.brand}>{brand}</span>
                    <span className={styles.category}>{category}</span>
                </div>

                <div className={styles.ratingContainer}>
                    <span className={styles.stars} title={`${rating} out of 5 stars`}>
                        {renderStars(rating)}
                    </span>
                    <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
                </div>

                <div className={styles.price}>
                    ${price.toFixed(2)}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;