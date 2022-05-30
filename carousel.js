class Carousel {

    #window;
    #windowWrapp;
    #items;
    #displayItems = 1;
    #marginItems;
    #dots;
    #autoUpdate;
    #intervalUpdate;
    #infinity;
    #changingItems = 1;
    #howManyDots;
    #firstElement = 0;
    #isInsideDots = false;
    #dotsPosition;
    #slickTransition;
    #dragDrop;
    #copyItems = 0;
    #itemsLength;
    #stackStep = null;

    #buttons;
    #isInsideArrs = false;

    constructor (box) {

        this.#window = box.window;
        this.#items = box.items;
        if (box.displayItems) this.#displayItems = box.displayItems;
        this.#infinity = box.infinity;
        if (box.changingItems) this.#changingItems = box.changingItems;
        this.#slickTransition = box.slickTransition;
        this.#dragDrop = box.dragDrop;
        this.#itemsLength = this.#items.length;

        if (box.dotsPosition) this.#dotsPosition = box.dotsPosition;
        else this.#dotsPosition =  {direction: 'bottom', margin: 5};

        if (box.buttons === true) {

            this.#buttons = {
                left: {
                    button: true,
                    position: {
                        direction: 'center',
                        margin: 10,
                    },
                    layout: null
                },
                right: {
                    button: true,
                    position: {
                        direction: 'center',
                        margin: 10,
                    },
                    layout: null
                },
            };

        } else this.#buttons = box.buttons;

        if (box.marginItems) this.#marginItems = box.marginItems;
        else this.#marginItems = {value: 0, units: 'px'};
        
        this.#dots = box.dots;

        if (typeof box.autoUpdate === 'number') this.#autoUpdate = {time: box.autoUpdate, rotation: 'right'};
        else this.#autoUpdate = box.autoUpdate;

        if (this.#autoUpdate && !this.#autoUpdate.rotation) this.#autoUpdate.rotation = 'right';

        this.#build();

    }

    setClass (element, className) {
        if (element === 'dot') {

            for (let i = 0; i < this.#dots.children.length; i++) {
                this.#dots.children[i].classList.add(className);
            }

        } else if (element === 'dots') {
            this.#dots.classList.add(className);
        } else if (element === 'arrows') {
            this.#buttons.left.button.classList.add(className);
            this.#buttons.right.button.classList.add(className);
        } else if (element === 'arrowLeft') {
            this.#buttons.left.button.classList.add(className);
        } else if (element === 'arrowRight') {
            this.#buttons.right.button.classList.add(className);
        } else if (element === 'wrapp') {
            this.#windowWrapp.classList.add(className);
        }
    }

    stopAutoUpdate () {
        clearInterval(this.#intervalUpdate);
    }

    startAutoUpdate (settings) {

        if (settings) {
            if (typeof settings === 'number') this.#autoUpdate = {time: settings, rotation: 'right'};
            else this.#autoUpdate = settings;
    
            if (this.#autoUpdate && !this.#autoUpdate.rotation) this.#autoUpdate.rotation = 'right';
        }

        if (this.#autoUpdate) this.#autoUpdateF();
    }

    getItem (item) {

        if (item === 'center') {
            return this.#items[this.#firstElement + Math.floor(this.#displayItems / 2)];
        } else if (typeof item === 'number') {
            return this.#items[this.#firstElement + item];
        } else if (item === 'first') {
            return this.#items[this.#firstElement];
        } else if (item === 'last') {
            return this.#items[this.#firstElement + this.#displayItems - 1];
        }

    }

    step (rotation) {
        this.#step(rotation);
    }

    #build () {

        if (this.#infinity) this.#setInfinity();

        this.#window.style.overflow = 'hidden';
        this.#windowWrapp = document.createElement('div');
        this.#windowWrapp.style.display = 'flex';

        for (let i = 0; i < this.#items.length; i++) {

            this.#items[i].style.marginLeft = this.#marginItems.value + this.#marginItems.units;
            this.#items[i].style.marginRight = this.#marginItems.value + this.#marginItems.units;

            this.#items[i].style['min-width'] = ((this.#window.clientWidth / this.#displayItems) - (this.#marginItems.value * 2)) + 'px';

            this.#windowWrapp.append(this.#items[i]);

        }

        this.#window.append(this.#windowWrapp);

        if (this.#dots) this.#createDots();

        if (this.#buttons) this.#createArrs();

        this.#hendlers();

        if (this.#isInsideDots) {
            this.#dots.style.left = ( (this.#window.offsetWidth / 2) - (this.#dots.offsetWidth / 2) ) + 'px';
            this.#dots.style[this.#dotsPosition.direction] = this.#dotsPosition.margin + 'px';
        }

        if (this.#isInsideArrs) {

            this.#setArrPosition ('left');
            this.#setArrPosition ('right');
            
        }

        this.#render();

        setTimeout( () => {
            this.#windowWrapp.style.transitionDuration = this.#slickTransition;
            if (this.#autoUpdate) this.#autoUpdateF();
        }, 5 );

    }

    #createDots () {

        this.#calculateHowManyDots();

        if (this.#dots === true) {

            this.#isInsideDots = true;

            this.#dots = document.createElement('div');
            this.#dots.classList.add('carousel__dots');
            console.log('You can stylize dots use class "carousel__dots div"');
            console.log('And "carousel__dots--active" for active dot');
            this.#window.style.position = 'relative';
            this.#dots.style.position = 'absolute';
            this.#window.append(this.#dots);

        }

        this.#dots.style.display = 'flex';
        this.#dots.style.justifyContent = 'center';
        this.#dots.style.alignItems = 'center';

        for (let i = 0; i < this.#howManyDots; i++) {
            let dot = document.createElement('div');
            this.#dots.append(dot);
        }

    }

    #createArrs () {

        if (this.#buttons.left.button === true) {

            this.#isInsideArrs = true;

            this.#buttons.left.button = document.createElement('div');
            this.#buttons.right.button = document.createElement('div');

            this.#window.style.position = 'relative';

            this.#buttons.left.button.style.position = 'absolute';
            this.#buttons.right.button.style.position = 'absolute';

            this.#buttons.left.button.classList.add('carusel__arrLeft');
            this.#buttons.right.button.classList.add('carusel__arrRight');

            if (this.#buttons.left.layout) {
                this.#buttons.left.button.innerHTML = this.#buttons.left.layout;
                this.#buttons.right.button.innerHTML = this.#buttons.right.layout;
            }

            this.#window.append(this.#buttons.left.button);
            this.#window.append(this.#buttons.right.button);

        }

    }

    #calculateHowManyDots () {
        // +(this.#itemsLength / this.#displayItems).toFixed()
        this.#howManyDots = Math.ceil(this.#itemsLength / this.#displayItems);
    }

    #render () {

        let dit = 0;
        if (!this.#infinity) dit = this.#displayItems;

        if (this.#firstElement < 0) this.#firstElement = 0;
        else if(this.#firstElement > this.#items.length - (this.#copyItems / 2) - dit) {
            this.#firstElement = this.#items.length - (this.#copyItems / 2) - dit;
        }

        let offsetMargin = (
            (
                (this.#items[0].getBoundingClientRect().width)
                    +
                ((this.#marginItems.value * 2))
            ) * this.#firstElement
        );

        this.#windowWrapp.style.marginLeft = '-' + offsetMargin.toFixed(2) + 'px';

        if (this.#dots) this.#setActiveDot();

    }

    #setArrPosition (x) {

        if (this.#buttons[x].position.direction === 'center') {
            this.#buttons[x].button.style.top = ( (this.#window.offsetHeight / 2) - (this.#buttons[x].button.offsetHeight / 2) ) + 'px';
        } else if (typeof this.#buttons[x].position.direction === 'number') {
            this.#buttons[x].button.style.top = this.#buttons[x].position.direction + 'px';
        }

        if (x === 'left') this.#buttons[x].button.style.left = this.#buttons[x].position.margin + 'px';
        if (x === 'right') this.#buttons[x].button.style.right = this.#buttons[x].position.margin + 'px';

    }

    #setHeandlersArrs (x) {

        this.#buttons[x].button.onclick = () => {

            this.#step(x);

        }

    }

    #hendlers () {

        if (this.#buttons) {
            this.#setHeandlersArrs('left');
            this.#setHeandlersArrs('right');
        }

        if (this.#dragDrop) this.#dragDropFunc();
        if (this.#dots) this.#hendlersClickOnDots();
    }

    #step (x, offs = 0, fE = null) {

        let animation = false;

        if (fE !== null) this.#firstElement = fE;
        if (offs !== 0) animation = true;

        if (x === 'left') this.#firstElement -= this.#changingItems;
        if (x === 'right') this.#firstElement += this.#changingItems;

        if (this.#firstElement > this.#items.length - this.#displayItems - offs) {
            if (this.#infinity) this.#infinityJump('right', animation);
            else this.#firstElement = this.#items.length - this.#displayItems;
        } else if (this.#firstElement < offs) {
            if (this.#infinity) this.#infinityJump('left', animation);
            else this.#firstElement = 0;
        } 

        this.#render();

    }

    #autoUpdateF () {

        this.#intervalUpdate = setInterval( () => {

            this.#step(this.#autoUpdate.rotation);

        }, this.#autoUpdate.time );
    }

    #dragDropFunc () {

        this.#windowWrapp.onpointerdown = (evD) =>  {

            evD.preventDefault();
            this.#windowWrapp.style.transitionDuration = null;

            let poindDown = evD.pageX + Math.abs(parseFloat(this.#windowWrapp.style.marginLeft));

            this.#windowWrapp.onpointermove = (evM) => {

                evM.preventDefault();

                let offset = poindDown - evM.pageX;

                let itemWidth = this.#items[0].offsetWidth + (this.#marginItems.value * 2);

                if (offset > (this.#firstElement * itemWidth) + (itemWidth * this.#changingItems)) {
                    offset = (this.#firstElement * itemWidth) + (itemWidth * this.#changingItems);
                } else if (offset < (this.#firstElement * itemWidth) - (itemWidth * this.#changingItems)) {
                    offset = (this.#firstElement * itemWidth) - (itemWidth * this.#changingItems);
                }

                this.#windowWrapp.style.marginLeft = (-1 * offset) + 'px';

                if (Math.abs(evD.pageX - evM.pageX) >= (this.#changingItems * (this.#items[0].offsetWidth + (this.#marginItems.value * 2))) / 2) {
                    if (evD.pageX - evM.pageX < 0) this.#stackStep = 'left';
                    else this.#stackStep = 'right';
                }
            }
            
        }

        window.onpointerup = () => {

            if (this.#windowWrapp.onpointermove) {

                this.#windowWrapp.onpointermove = null;
                this.#windowWrapp.style.transitionDuration = this.#slickTransition;
                this.#render();
    
                if (this.#stackStep) {
    
                    this.#step(this.#stackStep, this.#copyItems / 2);
    
                } else this.#render();
    
                this.#stackStep = null;

            }

        }

    }

    #setInfinity () {

        this.#firstElement = this.#displayItems;

        this.#copyItems = this.#displayItems * 2;

        this.#items = Array.from(this.#items);
        let arr = [];
        this.#items.forEach( item => {
            arr.push(item);
        } );

        for(let i = 0; i < this.#copyItems / 2; i++) {
            this.#items.unshift(arr[(arr.length - 1) - i].cloneNode(true));
        }

        for(let i = 0; i < this.#copyItems / 2; i++) {
            this.#items.push(arr[i].cloneNode(true));
        }

    }

    #infinityJump (direction, animationFirst) {

        if (!this.#infinity) return;

        if (animationFirst && direction === 'left') {

            setTimeout( () => {
                this.#windowWrapp.style.transitionDuration = null;
                this.#firstElement = ((this.#firstElement + this.#changingItems) + this.#itemsLength) - this.#changingItems;
                this.#render();
            }, parseFloat(this.#slickTransition) * 1000 );

        } else if (direction === 'left') {

            this.#windowWrapp.style.transitionDuration = null;
            this.#firstElement = (this.#firstElement + this.#changingItems) + this.#itemsLength;

            setTimeout( () => {
                this.#windowWrapp.style.transitionDuration = this.#slickTransition;
                this.#firstElement -= this.#changingItems;
                this.#render();
            }, 5 );

        } else if (animationFirst && direction == 'right') {

            setTimeout( () => {
                this.#windowWrapp.style.transitionDuration = null;
                this.#firstElement = ((this.#firstElement - this.#changingItems) - this.#itemsLength) + this.#changingItems;
                this.#render();
            }, parseFloat(this.#slickTransition) * 1000 );

        } else if (direction == 'right') { 

            this.#windowWrapp.style.transitionDuration = null;
            this.#firstElement = (this.#firstElement - this.#changingItems) - this.#itemsLength;

            setTimeout( () => {
                this.#windowWrapp.style.transitionDuration = this.#slickTransition;
                this.#firstElement += this.#changingItems;
                this.#render();
            }, 5 );

        }

    }

    #setActiveDot () {

        for (let i = 0; i < this.#dots.children.length; i++) {
            this.#dots.children[i].classList.remove('carousel__dots--active');
        }
        // +((this.#firstElement - (this.#copyItems / 2)) / this.#displayItems).toFixed();
        // Math.floor((this.#firstElement - (this.#copyItems / 2)) / this.#displayItems) 
        let index = Math.ceil((this.#firstElement - (this.#copyItems / 2)) / this.#displayItems);
        if (index < 0) index = this.#dots.children.length + index;
        if (index > this.#dots.children.length - 1) index = index - this.#dots.children.length; 
        this.#dots.children[index].classList.add('carousel__dots--active');
        
    }

    #hendlersClickOnDots () {
        for (let i = 0; i < this.#dots.children.length; i++) {
            this.#dots.children[i].onclick = () => {
                this.#firstElement = (i * this.#displayItems) + (this.#copyItems / 2);
                this.#render();
            }
        }
    }

}