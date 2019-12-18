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
    bindScrollEvents();

};

let bindScrollEvents = function () {

    let mouseScroll = function (e) {

        let delta = e.wheelDelta || -e.detail;

        let direction = "up"

        if (delta < 0) {
            direction = "down";
        }

        scroll(direction, 4);



    };

    $(document)[0].addEventListener("mousewheel", mouseScroll);
    $(document)[0].addEventListener("DOMMouseScroll", mouseScroll);

    let lastTouchY = 0;
    let lastDirection = "up";
    let scrollInterval = null;

    let scrollerContainer = $(".scrollerOverlayContainer");
    let scrollerElement = scrollerContainer.find(".scrollerRegion");

    let containerHeight = scrollerContainer.height();
    let scrollerHeight = scrollerElement.height();

    let maxHeight = containerHeight - scrollerHeight;

    let touchStart = function (e) {

        e.stopPropagation();
        
        let touches = e.touches;
        if (touches.length === 1) {
            
            let touch = touches[0];
            
            lastTouchY = touch.clientY;

            if ( $(e.target).closest(".navigationContainer").length === 0 ) {
                
                scrollInterval = setInterval(function () {
    
                    scroll(lastDirection);
    
                }, 10);
                
                let touchMove = function(innerEvent) {
                
                    innerEvent.stopPropagation();
                    
                    let innerTouches = innerEvent.touches;
                    if (innerTouches.length === 1) {
            
                        let direction = "down"
            
                        let innerTouch = innerTouches[0];
                        if (innerTouch.clientY >= lastTouchY) {
                            direction = "up";
                        }
            
                        lastTouchY = innerTouch.clientY;
    
                        lastDirection = direction;
            
                        //lastTouchY = innerTouch.clientY;
            
                    }
                    else{
                        console.log("(A)multi-touch detected on doc touch move.  Currently, no handling implemented for this.");
                    }
                        
                };
            
                e.target.addEventListener("touchmove", touchMove);
    
                let touchEnd = function (innerEvent) {
    
                    if ( scrollInterval !== null ){
                        clearInterval(scrollInterval);
                    }
                    innerEvent.target.removeEventListener("touchmove", touchMove);
                    innerEvent.target.removeEventListener("touchend", touchEnd);
    
                };
            
                e.target.addEventListener("touchend", touchEnd);

            }
            else if ($(e.target).closest(".scrollerRegion").length === 1) {
                
                let colPosition = scrollerElement[0].getBoundingClientRect();
                
                let yOffset = colPosition.top - lastTouchY;
                
                let touchMove = function(innerEvent) {
                
                    innerEvent.stopPropagation();
                    
                    let innerTouches = innerEvent.touches;
                    if (innerTouches.length === 1) {

                        let innerTouch = innerTouches[0];
                              
                        let y = innerTouch.clientY;

                        if ( (y + yOffset) < 0 ) {
                            y = -yOffset;
                        }else if ( (y + yOffset) > maxHeight ) {
                            y = maxHeight - yOffset;
                        }
                        scrollerElement[0].style.top = (y + yOffset).toString() + "px";
                
                        let scrollPercentage = (y + yOffset) / maxHeight;
                
                        scrollPageByScroller(scrollPercentage);
            
                    }
                    else{
                        console.log("(B)multi-touch detected on doc touch move.  Currently, no handling implemented for this.");
                    }
                        
                };
            
                e.target.addEventListener("touchmove", touchMove);
    
                let touchEnd = function (innerEvent) {
    
                    if ( scrollInterval !== null ){
                        clearInterval(scrollInterval);
                    }
                    innerEvent.target.removeEventListener("touchmove", touchMove);
                    innerEvent.target.removeEventListener("touchend", touchEnd);
    
                };
            
                e.target.addEventListener("touchend", touchEnd);

            }

        }

    };

    $(document)[0].addEventListener("touchstart", touchStart);

    

};

let scroll = function (direction, weight) {

    direction = direction || "down";
    weight = weight || 1;

    if (direction === "down") {
        weight = weight * -1;
    }

    let deltaY = weight * 10;

    scrollContent(deltaY);

    updateScrollerPositionToContentScroll();

};

let scrollContent = function (deltaY) {

    let contentContainer = $(".innerContentContainer");

    let currentScrollPosition = contentContainer[0].scrollTop;
    let newScrollPosition = currentScrollPosition - deltaY;

    if ( newScrollPosition < 0 ) {
        newScrollPosition = 0;
    }
    else if ( newScrollPosition > contentContainer.scrollHeight ) {
        newScrollPosition = scrollHeight;
    }

    contentContainer[0].scrollTop = newScrollPosition;

};

let updateScrollerPositionToContentScroll = function () {

    let contentContainer = $(".innerContentContainer");
    let scrollerContainer = $(".scrollerOverlayContainer");
    let scroller = scrollerContainer.find(".scrollerRegion");

    let scrollPercentage = contentContainer[0].scrollTop / (contentContainer[0].scrollHeight - contentContainer.height());
    
    let contentScrollableHeight = scrollerContainer.height() - scroller.height();

    let setScrollTop = contentScrollableHeight * scrollPercentage;

    scroller[0].style.top = setScrollTop.toString() + "px";

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

        let mouseY = e.clientY;

        let colPosition = dragTarget[0].getBoundingClientRect();

        yOffset = colPosition.top - mouseY;

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

    /*

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

    */

};