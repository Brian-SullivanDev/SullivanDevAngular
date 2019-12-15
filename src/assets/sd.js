$(document).ready(function() {

    performScrollerHandling();
    setupPreviewElement();

});

let setPreviewScale = function () {

    let mainContentContainer = $(".innerContentContainer");
    
    let previewContainer = $(".previewScrollerContainer");

    let baseValue = 4.25; //determineAppropriateScale();

    let containerPaddingScaling = 0.5;
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
        element.style.width = "calc( 100% - " + (marginLeftScale * baseValue).toString() + " )";

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

    let scrollDragStart = function () {

        console.log("hi");

    };

    scrollerBlock[0].ondragstart = scrollDragStart;

};

configureScrollEvents = function () {

    let dragstart = function (e) {

        e.preventDefault();
        let dragTarget = $(e.target);

        let mouseX = e.clientX;
        let mouseY = e.clientY;

        let colPosition = dragTarget[0].getBoundingClientRect();

        xOffset = colPosition.left - mouseX;
        yOffset = colPosition.top - mouseY;
        
        currentDragColumn = setColumnDragger(uniqueID, dragTarget);
        createPlaceholderForColumnElement(uniqueID, dragTarget);

        updateDragColumnPosition(mouseX, mouseY);
        
        log("dragstart");

        $(document).bind("mousemove", dragmouse);
        $(document).bind("mouseup", mouseup);

    };

    

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