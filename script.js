class Gallery {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.currentImageIndex = 0;
        this.filteredImages = [...document.querySelectorAll('.image-card')];
    }

    initializeElements() {
        // Gallery elements
        this.gallery = document.querySelector('.gallery');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.images = document.querySelectorAll('.image-card');

        // Lightbox elements
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = this.lightbox.querySelector('img');
        this.lightboxCaption = this.lightbox.querySelector('.lightbox-caption');
        this.closeButton = this.lightbox.querySelector('.lightbox-close');
        this.prevButton = this.lightbox.querySelector('.lightbox-prev');
        this.nextButton = this.lightbox.querySelector('.lightbox-next');
    }

    setupEventListeners() {
        // Filter buttons
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => this.filterImages(button));
        });

        // Image click for lightbox
        this.images.forEach(image => {
            image.addEventListener('click', () => this.openLightbox(image));
        });

        // Lightbox controls
        this.closeButton.addEventListener('click', () => this.closeLightbox());
        this.prevButton.addEventListener('click', () => this.navigateImage('prev'));
        this.nextButton.addEventListener('click', () => this.navigateImage('next'));
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));

        // Close lightbox when clicking outside
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });
    }

    filterImages(selectedButton) {
        // Update active button
        this.filterButtons.forEach(button => button.classList.remove('active'));
        selectedButton.classList.add('active');

        const category = selectedButton.getAttribute('data-filter');

        // Filter images
        this.images.forEach(image => {
            const imageCategory = image.getAttribute('data-category');
            image.style.display = 'none';
            
            if (category === 'all' || category === imageCategory) {
                image.style.display = 'block';
                image.style.animation = 'fadeIn 0.5s ease forwards';
            }
        });

        // Update filtered images array
        this.filteredImages = [...this.images].filter(image => {
            const imageCategory = image.getAttribute('data-category');
            return category === 'all' || category === imageCategory;
        });
    }

    openLightbox(image) {
        // Set current image
        const imgSrc = image.querySelector('img').src;
        const title = image.querySelector('h3').textContent;
        const description = image.querySelector('p').textContent;

        this.lightboxImage.src = imgSrc;
        this.lightboxCaption.querySelector('h3').textContent = title;
        this.lightboxCaption.querySelector('p').textContent = description;

        // Set current index
        this.currentImageIndex = this.filteredImages.indexOf(image);

        // Show lightbox
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    navigateImage(direction) {
        if (direction === 'prev') {
            this.currentImageIndex = (this.currentImageIndex - 1 + this.filteredImages.length) % this.filteredImages.length;
        } else {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.filteredImages.length;
        }

        const newImage = this.filteredImages[this.currentImageIndex];
        this.openLightbox(newImage);
    }

    handleKeyboardNavigation(e) {
        if (!this.lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowLeft':
                this.navigateImage('prev');
                break;
            case 'ArrowRight':
                this.navigateImage('next');
                break;
        }
    }
}

// Initialize gallery when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new Gallery();
});
