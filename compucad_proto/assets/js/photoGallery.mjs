export class PhotoGallery {
    constructor(galleryElement, xRotationDegrees) {
        this.galleryElement = galleryElement;
        this.xRotationDegrees = xRotationDegrees;
        
        this.centerElement(this.galleryElement.querySelector('.photo-container.active'));
        this.setupListeners();
    }
    
    setupListeners() {
        this.observer = new MutationObserver(
            (mutationsList, observer) => this.mutationCallback(mutationsList, observer)
        );
        const moConfig = {attributes: true};
        this.galleryElement.querySelectorAll('div.photo-container').forEach(el => {
            
            el.addEventListener('click', e => this.photoClicked(e));
            
            this.observer.observe(el, moConfig);
        });
        
        this.galleryElement.addEventListener('swiped-left', e => this.swipedLeft(e));
        this.galleryElement.addEventListener('swiped-right', e => this.swipedRight(e));
    }
    
    photoClicked(e) {
        const clickedEl = e.currentTarget;
        const currentActive = this.galleryElement.querySelector('.active');
        
        currentActive.classList.remove('active');
        clickedEl.classList.add('active');
    }
    
    mutationCallback(mutationsList, observer) {
        mutationsList.forEach(mutation => {
            if (mutation.type !== "attributes" || mutation.attributeName !== "class") {
                return;
            }
            
            if (mutation.target.classList.contains("active")) {
                this.centerElement(mutation.target);
            }
        })
    }
    
    centerElement(el) {
        const gallerySpaceEl = this.galleryElement.querySelector('.gallery-space'),
            translationAmount = ((gallerySpaceEl.offsetWidth - el.offsetWidth) / 2) - el.offsetLeft,
            transformation = `rotateX(${this.xRotationDegrees}deg) translateX(${translationAmount}px)`;
            
        gallerySpaceEl.style.webkitTransform = transformation;
        gallerySpaceEl.style.MozTransform = transformation;
        gallerySpaceEl.style.msTransform = transformation;
        gallerySpaceEl.style.OTransform = transformation;
        gallerySpaceEl.style.transform = transformation;
    }
    
    swipedLeft(e) {
        const selectedElement = this.galleryElement.querySelector('.photo-container.active'),
            allPhotos = Array.from(this.galleryElement.querySelectorAll('.photo-container')),
            selectedIndex = allPhotos.indexOf(selectedElement);
        
        selectedElement.classList.remove('active');
        allPhotos[Math.min(allPhotos.length - 1, selectedIndex + 1)].classList.add('active');
    }
    
    swipedRight(e) {
        const selectedElement = this.galleryElement.querySelector('.photo-container.active'),
            allPhotos = Array.from(this.galleryElement.querySelectorAll('.photo-container')),
            selectedIndex = allPhotos.indexOf(selectedElement);
        
        selectedElement.classList.remove('active');
        allPhotos[Math.max(0, selectedIndex - 1)].classList.add('active');
    }
}