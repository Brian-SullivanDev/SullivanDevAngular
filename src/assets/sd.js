$(document).ready(function() {

    performScrollerHandling();

});

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