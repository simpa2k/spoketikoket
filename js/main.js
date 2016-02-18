//Vanilla JavaScript

/*
 * 
 * Declarations and initializations
 *
 */

// Storing the #main div.
var main = document.getElementById('main');

// Declaring variable to store window.setInterval in, making it possible to clear later.
var animate;

// Storing heading buttons.
var shows = document.getElementById('shows');
var about = document.getElementById('about');
var musikOchFilm = document.getElementById('musikochfilm');
var kontakt = document.getElementById('kontakt');

// Initializing variables associated with the to the top button.
var toTheTop = document.getElementById('to-top');
// The 'visible' radio button.
var toTheTopVisible = document.getElementById('visible');
// The 'not-visible' radio button.
var toTheTopInvisible = document.getElementById('not-visible');

// Storing dropdown menu
var earlierGigsDropDownButton = document.getElementById('dropdown-menu-button'); 
var earlierGigs = document.getElementsByClassName('dropdown-menu-item');

// Hiding earlier gigs
hideEarlierGigs();

/* 
 * 
 * Functions
 *
 */

// Function to determine whether to display to the top button or not.
function toTheTopDisplay() {
    var mainBoundingClientRect = main.getBoundingClientRect();
    var mainY = mainBoundingClientRect.top;
    var windowHeight = window.innerHeight;
    
    // Display to the top button when #main is taking up about half of the screen or more:
    if (mainY < (windowHeight / 2)) {
        toTheTopVisible.checked = "true";
    } else {
        toTheTopInvisible.checked = "true";
    }   
}

// Function to scroll to the top of the document. To be called by toTheTopClick on clicking the to the top button.
function scrollUp() {
    if (window.scrollY == 0) {
        stopScroll();
    } else {
        var scrollY = -100;
        window.scrollBy(0, scrollY);
        scrollY += 10;
    }
}

// Scroll function to be called on clicking the to the top button.
function toTheTopClick() {
    animate = window.setInterval(scrollUp, 5);
}

// Function to clear window.setInterval
function stopScroll() {
    clearInterval(animate);
}

// Function to determine an element's position on the y-axis.
function getY(element) {
    var boundingClientRect = element.getBoundingClientRect();
    var y = boundingClientRect.top + window.scrollY;
    
    return y;
}

// Function to get the x-value of the text sections. This is to prevent mobile devices from landing the viewport
// to far to the left when a heading is clicked while zoomed in.
function getSectionHeadingX() {
    //It doesn't matter which one since all sections have the same x-value
    var sectionHeading = document.getElementsByClassName('section-heading');
    xPos = (sectionHeading[0].offsetLeft - sectionHeading[0].scrollLeft + sectionHeading[0].clientLeft);
    
    return xPos;
}

// Function to determine which heading item was clicked and call getSectionHeadingX and getY with the relevant element 
// in order scroll down to it.
function headingClick(e) {
    var item = e.target;
    if (item.className == "heading") {
        switch(item.innerHTML) {
            case 'KONSERTER':
                window.scrollTo(getSectionHeadingX(), getY(shows));
            break;
            case 'OM SPÖKET':
                window.scrollTo(getSectionHeadingX(), getY(about));
            break;
            case 'MUSIK OCH MEDIA':
                window.scrollTo(getSectionHeadingX(), getY(musikOchFilm));
            break;
            case 'KONTAKT':
                window.scrollTo(getSectionHeadingX(), getY(kontakt));
            break;
        }
    }
}

// Function to display earlier gigs, to be called when you click on earlierGigsDropDownButton
function hideOrDisplayEarlierGigs() {
    for( var i = 0; i < earlierGigs.length; i++ ) {
        if( earlierGigs[i].style.display == "none") {
            earlierGigs[i].style.display = "block";
        } else {
            earlierGigs[i].style.display = "none";
        }
    }
}

// Function to hide earlier gigs, to be called on document load
function hideEarlierGigs() {
    for( var i = 0; i < earlierGigs.length; i++ ) {
        earlierGigs[i].style.display = "none";
    }
}

// Function to delete database entry
function deleteEntry() {
    console.log("working");
    var xhttp = new XMLHttpRequest();

    xhttp.open("POST", "127.0.0.1", false);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    send("test");
}

// Adding event listeners
toTheTop.addEventListener('click', toTheTopClick, false);
main.addEventListener('click', headingClick, false);
window.addEventListener('scroll', toTheTopDisplay, false);
earlierGigsDropDownButton.addEventListener('click', hideOrDisplayEarlierGigs, false);

/*
 * Jag tog bort en animerad scrolldown när man trycker på headingknapparna eftersom det var svårt att få
 * scrollen att stanna när man vill (den skjuter lätt över målet om man inte sätter ett väldigt lågt scrollvärde varje gång
 * funktionen callas) och att det inte nödvändigtvis ser jättesnyggt ut. Sparar lite exempelkod ifall det skulle bli aktuellt
 * igen:
 *
 * var headingClick = function(e) {
    var item = e.target;
    if (item.className == "heading") {
        switch(item.innerHTML) {
            case 'Shows':
                destination = shows;
                animate = window.setInterval(scrollDown, 1);
            break;
            etc.
            
 * var destination;

 * var scrollDown = function() {
        if (window.scrollY >= getY(destination)) {
            stopScroll();
        } else {
            window.scrollBy(0, 50);
        }
    }
 * 
 */