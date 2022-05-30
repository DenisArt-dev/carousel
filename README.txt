// ------ create object --------

let catousel = new Carousel( {
    window: document.querySelector('.window'),
    items: document.querySelectorAll('.el'),
    buttons: {
        left: {
            button: true,
            position: {
                direction: 'center',
                margin: 20,
            },
            layout: '<button>назад</button>'
        },
        right: {
            button: true,
            position: {
                direction: 'center',
                margin: 20,
            },
            layout: '<button>вперед</button>'
        },
    },
    displayItems: 2,
    changingItems: 2,
    marginItems: {
        value: 10,
        units: 'px',
        noFirstLast: true
    },
    dots: true, // document.querySelector('.dots')
    dotsPosition: {
        direction: 'bottom',
        margin: 5
    },
    autoUpdate: {
        time: 3000,
        rotation: 'right'
    },
    infinity: true,
    slickTransition: '0.5s',
    dragDrop: true,
} );