$(document).ready(function() {

    test();

});

let test = function () {

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