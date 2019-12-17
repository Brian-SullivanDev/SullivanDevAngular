$(document).ready(function() {

    performScrollerHandling();
    setupPreviewElement();

});

let determineAppropriateScale = function () {

    let mainContentContainer = $(".innerContentContainer");

    let mainContentHeight = mainContentContainer.find(".introductionContainer").height() + 
    mainContentContainer.find(".goalsAndDreamsContainer").height() + 
    mainContentContainer.find(".workHistoryContainer").height() + 
    mainContentContainer.find(".futurePlansContainer").height();

    let scrollerContainer = $(".scrollerOverlayContainer");

    let scrollerHeight = scrollerContainer.height();

    let heightScale = scrollerHeight / mainContentHeight;

    return heightScale * 16;

};

let setPreviewScale = function () {
    
    let previewContainer = $(".previewScrollerContainer");

    let baseValue = determineAppropriateScale();

    let mainWidth = $(".innerContentContainer").width();

    let widthScale = mainWidth / 16.0;

    $(".scrollerOverlayContainer")[0].style.width = (baseValue * widthScale).toString() + "px";
    $(".previewScrollerContainer")[0].style.width = (baseValue * widthScale).toString() + "px";

    let containerPaddingScaling = 0.5;

    let scrollerWrapper = $(".previewScrollerOuterContainer");

    scrollerWrapper[0].style.padding = (baseValue * containerPaddingScaling).toString() + "px";
    scrollerWrapper[0].style.width = "calc( 100% - " + (baseValue * containerPaddingScaling * 2).toString() + "px)";
    scrollerWrapper[0].style.height = "calc( 100% - " + (baseValue * containerPaddingScaling * 2).toString() + "px)";

    let headerFontScaling = 2.0;
    let headerMarginBottomScaling = 1.0;
    let headerMarginLeftScaling = 1.0;
    let subHeaderFontScaling = 1.5;
    let subHeaderMarginBottomScaling = 1.0;
    let subHeaderMarginLeftScaling = 2.0;
    let textFontScaling = 1.0;
    let textMarginBottomScaling = 2.0;
    let textMarginLeftScaling = 3.0;
    let spacerHeightScaling = 3.0;

    let headers = previewContainer.find(".header");
    let subHeaders = previewContainer.find(".subHeader");
    let textBlocks = previewContainer.find(".text");
    let spacers = previewContainer.find(".spacer");

    let setScale = function(element, fontScale, marginBottomScale, marginLeftScale) {

        element.style.fontSize = (fontScale * baseValue).toString() + "px";
        element.style.marginBottom = (marginBottomScale * baseValue).toString() + "px";
        element.style.marginLeft = (marginLeftScale * baseValue).toString() + "px";
        element.style.width = "calc( 100% - " + (marginLeftScale * baseValue).toString() + "px )";

    };

    headers.each(function() {
        setScale(this, headerFontScaling, headerMarginBottomScaling, headerMarginLeftScaling);
    });
    
    subHeaders.each(function() {
        setScale(this, subHeaderFontScaling, subHeaderMarginBottomScaling, subHeaderMarginLeftScaling);
    });
    
    textBlocks.each(function() {
        setScale(this, textFontScaling, textMarginBottomScaling, textMarginLeftScaling);
    });

    spacers.each(function() {
        this.style.height = (spacerHeightScaling * baseValue).toString() + "px";
    });

};

let setupPreviewElement = function () {

    let cloneHTML = $(".mainContentContainer > .innerContentContainer")[0].innerHTML;
    
    $(".previewScrollerContainer").html(cloneHTML);

    setPreviewScale();

};

let performScrollerHandling = function () {

    setupScrollBindings();
    resizeScrollerControl();
    configureScrollEvents();

};

let setupScrollBindings = function () {

    let scrollerBlock = $(".scrollerRegion");

    let scrollDragBinder = function (e) {

        if ( window.scrollDragStart !== undefined ) {
            window.scrollDragStart(e);
        }

    };

    scrollerBlock[0].ondragstart = scrollDragBinder;

};

let scrollPageByScroller = function (scrollPercentage) {

    let contentContainer = $(".innerContentContainer");

    let contentScrollableHeight = contentContainer[0].scrollHeight - contentContainer.height();

    let setScrollTop = contentScrollableHeight * scrollPercentage;

    contentContainer[0].scrollTop = setScrollTop;

};

let configureScrollEvents = function () {

    let yOffset = 0;

    let scrollerContainer = $(".scrollerOverlayContainer");
    let scrollerElement = scrollerContainer.find(".scrollerRegion");

    let containerHeight = scrollerContainer.height();
    let scrollerHeight = scrollerElement.height();

    let maxHeight = containerHeight - scrollerHeight;

    let updateDragPosition = function (y) {

        if ( (y + yOffset) < 0 ) {
            y = -yOffset;
        }else if ( (y + yOffset) > maxHeight ) {
            y = maxHeight - yOffset;
        }
        scrollerElement[0].style.top = (y + yOffset).toString() + "px";

        let scrollPercentage = (y + yOffset) / maxHeight;

        scrollPageByScroller(scrollPercentage);
    
    };

    let dragmouse = function (e) {

        let mouseY = e.clientY;

        updateDragPosition(mouseY);

    }

    let mouseup = function (e) {

        $(document)[0].removeEventListener("mousemove", dragmouse, false);
        $(document)[0].removeEventListener("mouseup", mouseup, false);

    }

    let dragstart = function (e) {

        e.preventDefault();
        let dragTarget = $(e.target);
        console.log(dragTarget);

        let mouseY = e.clientY;

        let colPosition = dragTarget[0].getBoundingClientRect();

        yOffset = colPosition.top - mouseY;

        //updateDragPosition(mouseX, mouseY);
        
        console.log("dragstart");

        $(document)[0].addEventListener("mousemove", dragmouse, false);
        $(document)[0].addEventListener("mouseup", mouseup, false);

    };

    window.scrollDragStart = dragstart;

};

// update the scroll display and events tied to the 
let resizeScrollerControl = function () {

    let scrollContainerHeight = $(".navigationContainer").height();

    let introHeight = $(".introductionContainer").height();
    let goalsHeight = $(".goalsAndDreamsContainer").height();
    let historyHeight = $(".workHistoryContainer").height();
    let futureHeight = $(".futurePlansContainer").height();

    let totalHeight = introHeight + goalsHeight + historyHeight + futureHeight;

    let introScrollHeight = (scrollContainerHeight * introHeight / totalHeight).toString() + "px";
    let goalsScrollHeight = (scrollContainerHeight * goalsHeight / totalHeight).toString() + "px";
    let historyScrollHeight = (scrollContainerHeight * historyHeight / totalHeight).toString() + "px";
    let futureScrollHeight = (scrollContainerHeight * futureHeight / totalHeight).toString() + "px";

    $(".introductionNavItem").height(introScrollHeight);
    $(".introductionNavItem")[0].style.lineHeight = introScrollHeight;
    $(".goalsAndDreamsNavItem").height(goalsScrollHeight);
    $(".goalsAndDreamsNavItem")[0].style.lineHeight = goalsScrollHeight;
    $(".workHistoryNavItem").height(historyScrollHeight);
    $(".workHistoryNavItem")[0].style.lineHeight = historyScrollHeight;
    $(".futurePlansNavItem").height(futureScrollHeight);
    $(".futurePlansNavItem")[0].style.lineHeight = futureScrollHeight;

    let scroller = $(".scrollerRegion");

    let scrollerHeightWeight = scrollContainerHeight / totalHeight;

    if ( scrollerHeightWeight > 1 ) {

        scrollerHeightWeight = 1;

    }

    let scrollerHeight = scrollContainerHeight * scrollerHeightWeight;

    scroller.height(scrollerHeight);

    let debugInitialData = {
        intro: introHeight,
        goals: goalsHeight,
        history: historyHeight,
        future: futureHeight,
        total: totalHeight
    };
    
    let debugFinalData = {
        intro: introScrollHeight,
        goals: goalsScrollHeight,
        history: historyScrollHeight,
        future: futureScrollHeight
    };

    console.log(scrollContainerHeight);
    console.log(debugInitialData);
    console.log(debugFinalData);

};