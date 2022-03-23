class ListProperties{
    constructor(catalogItems, item, catalogElem, ItemWidth, poleWidth, polePadding)
    {
        this.catalogItems = catalogItems;
        this.itemCount = 0;
        this.item = item;
        this.itemWidth = ItemWidth;
        this.catalogElem = catalogElem;
        this.countVisElem = poleWidth / this.itemWidth;
        this.countVisElem = Math.trunc(this.countVisElem);
        this.ownMarginWidth = this.poleWidth - this.countVisElem * this.itemWidth;
        this.polePadding = polePadding.slice(0, polePadding.length - 2);
        this.polePadding = Number(this.polePadding);
        this.ownMarginWidth = poleWidth - this.countVisElem * this.itemWidth;
        this.itemMargin = this.ownMarginWidth / this.countVisElem;
        this.position = 0;
    }
    calcMargin()
    {
        for (let i = 0; i < this.catalogItems.length; i++) {
            this.catalogItems[i].style.marginRight = this.itemMargin + 'px';
        }
    }
    ScrollLeft()
    {
        if (this.itemCount > 0) {
            this.position = (this.polePadding + this.itemWidth + (this.itemMargin - this.polePadding)) * (this.itemCount - 1);
            this.catalogItems[0].style.marginLeft = '-' + this.position + 'px';
            this.itemCount--;
        } else {
            return 0;
        }
    }
    ScrollRight()
    {

        if (this.itemCount < this.catalogItems.length - this.countVisElem) {
            this.position = (this.polePadding + this.itemWidth + (this.itemMargin - this.polePadding)) * (this.itemCount + 1);
            this.catalogItems[0].style.marginLeft = '-' + this.position + 'px';
            this.itemCount++;
        } else {
            return 0;
        }
    }
}

function calcScrollList(value){
    if(value == true){
        let catalogItems = new Array();
        catalogItems = document.querySelectorAll('li.imagesCatalogItem');
        let item = document.querySelector('li.imagesCatalogItem');
        let catalogElem = document.querySelector('div.galleryCatalog');
        let itemProp = item.getBoundingClientRect();
        let ItemWidth = itemProp.width;
        ItemWidth = Number(ItemWidth);
        let elemProperties = catalogElem.getBoundingClientRect();
        let poleWidth = elemProperties.width;
        poleWidth = Number(poleWidth);
        let polePadding = window.getComputedStyle(catalogElem, null).getPropertyValue("padding");
        let CatalogList = new  ListProperties(catalogItems, item, catalogElem, ItemWidth, poleWidth, polePadding);
        CatalogList.calcMargin();

        let arrowLeft = document.getElementById("catalogPrev");
        arrowLeft.onclick = handlerLeft;
        let arrowRight = document.getElementById("catalogNext");
        arrowRight.onclick = handlerRight;
        function  handlerRight() {
            CatalogList.ScrollRight();
        }
        function handlerLeft() {
            CatalogList.ScrollLeft();
        }
        CatalogList.calcMargin();

        let catalogItemsPop = new Array();
        catalogItemsPop = document.querySelectorAll('li.PopImagesCatalogItem');
        let itemPop = document.querySelector('li.PopImagesCatalogItem');
        let catalogElemPop = document.querySelector('div.PopGalleryCatalog');
        let itemPropPop = itemPop.getBoundingClientRect();
        let ItemWidthPop = itemPropPop.width;
        ItemWidthPop = Number(ItemWidthPop);
        let elemPropertiesPop = catalogElemPop.getBoundingClientRect();
        let poleWidthPop = elemPropertiesPop.width;
        poleWidthPop = Number(poleWidthPop);
        let polePaddingPop = window.getComputedStyle(catalogElemPop, null).getPropertyValue("padding");
        let CatalogListPop = new  ListProperties(catalogItemsPop, itemPop, catalogElemPop, ItemWidthPop, poleWidthPop, polePaddingPop);
        CatalogListPop.calcMargin();

        let arrowLeftPop = document.getElementById("catalogPrevPop");
        arrowLeftPop.onclick = handlerLeftPop;
        let arrowRightPop = document.getElementById("catalogNextPop");
        arrowRightPop.onclick = handlerRightPop;
        function  handlerRightPop() {
            CatalogListPop.ScrollRight();
        }
        function handlerLeftPop() {
            CatalogListPop.ScrollLeft();
        }
        CatalogListPop.calcMargin();
    }
    else {
        return;
    }
}

$(window).on("load", function() {
    calcScrollList(true);
})

$(window).resize(function() {
    calcScrollList(true);
})

