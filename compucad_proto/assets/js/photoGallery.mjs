export class PhotoGallery {
    constructor(galleryElement, xRotationDegrees) {
        this.galleryElement = galleryElement;
        this.xRotationDegrees = xRotationDegrees;
        
        const imageElements = Array.from(this.galleryElement.querySelectorAll('.gallery-image'));
        imageElements.forEach((imgEl) => {imgEl.classList.add('invisible')});
        this.galleryElement.querySelector('.gallery-space').classList.add('invisible');
        
        const imagePromises = imageElements.map((el) => this.loadImagePromise(el));
        
        Promise.allSettled((imagePromises)).then((results) => {
            let totalWidth = 0;
            const firstImageResult = results[0],
                firstImageWidth = firstImageResult.status == 'fulfilled' 
                        ? firstImageResult.value.img.naturalWidth * (firstImageResult.value.el.height / firstImageResult.value.img.naturalHeight)
                        : 0 ;
            
            results.forEach((result) => {
                if (result.status == 'fulfilled') {
                    const imageWidth = result.value.img.naturalWidth;
                    const resizeRatio = result.value.el.height / result.value.img.naturalHeight;
                    const elStyle = window.getComputedStyle(result.value.el);
                    
                    totalWidth += (imageWidth * resizeRatio) + parseInt(elStyle.marginLeft) + parseInt(elStyle.marginRight);
                    
                    result.value.el.src = result.value.img.src;
                }
            });
            
            imageElements.forEach((imgEl) => {imgEl.classList.remove('invisible')});
            this.centerElement(this.galleryElement.querySelector('.photo-container.active'), (totalWidth / 2) - (firstImageWidth / 2));
            
            window.setTimeout(() => {
                this.galleryElement.querySelector('.gallery-space').classList.remove('invisible');
                this.setupListeners();
                this.galleryElement.classList.add('animated');
            }, 10)
        });
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
    
    loadImagePromise(imgEl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({el: imgEl, img: img});
            };
            
            img.onError = () => {
                reject();
            };
            
            img.src = encodeURI(imgEl.dataset.src);
        });
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
    
    centerElement(el, manualTranslationAmount = null) {
        const gallerySpaceEl = this.galleryElement.querySelector('.gallery-space'),
            translationAmount = manualTranslationAmount != null 
                    ? manualTranslationAmount 
                    : ((gallerySpaceEl.offsetWidth - el.offsetWidth) / 2) - el.offsetLeft,
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