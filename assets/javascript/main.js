let image_container = $("#image-container");
let guess_cont = $("#guess-container");
let word;
let incorrectGuesses = 0;
let correctGuesses = 0;
let winLength = 0;
let successes;

//pull in and read dictionary from online
function readDictionary() {
    let result = null;
    let file = 'https://raw.githubusercontent.com/adambom/dictionary/master/dictionary.json';
    return $.ajax({
        url: file,
        type: 'get',
        dataType: 'json',
        async: true,
        success: function(data) {
            result = Object.keys(data);
            let randLineNum = Math.floor(Math.random() * result.length);
            word = result[randLineNum];
        } 
    });
}

//Start the game and pick a word
function initializeAndPickWord() {
    //reset variables
    successes = [];
    correctGuesses = 0;
    incorrectGuesses = 0;

    //set initial image for hangman
    image_container.css({"background-image":"url('/assets/images/0.jpg')",
            "background-size":"25% 75%", "background-repeat":"no-repeat", "background-position":"center center"});
            $("img").css("background")
    guess_cont.html("");

    $.when(readDictionary()).done(function () {
    displayLines();

    $("#guess").on("keyup", keyBoard);
    });
}

//display the lines and set event handlers
function displayLines () {
    winLength = word.length;

    for (let i=0; i < word.length; i++) {
        if(word[i] != " ") {
            guess_cont.append("<div class='line " + i + "'" + " >");
        }
        else {
            guess_cont.append("<div class=blank />");
            winLength--;
        }
    }

    //create guesses area
    guess_cont.append("<br><br><div id=guesses>Guesses: </div>");
    $("#guesses").css("font-size","3rem");

    //set styling of game lines
    let w = 100 / word.length;
    $(".line").css({"width":"calc(" + w + "% - 60px)", 
    "box-sizing":"border-box", "margin":"30px", "border-bottom":"2px solid black",
    "display":"inline-block", "vertical-align":"top", "padding":"9px"})

    //set styling of blank spaces for separated words
    $(".blank").css({"box-sizing":"border-box", "margin":"30px",
    "display":"inline-block", "vertical-align":"top", "padding":"9px"})
}

//determines what happens when guess typed in
function keyBoard(event) {
    let enter = 13;
    //tracks if the guess was correct
    let noMatch = true;

    if(event.which === enter) {
        if(successes.indexOf(this.value) == -1) {
            for(let i=0; i<word.length; i++) {
                if(word[i].toLowerCase() === this.value.toLowerCase()) {
                    correctGuesses++;
                    noMatch = false;

                    $(".line." + i).html(this.value).css({"text-align":"center", "border-bottom":"none",
                    "font-size":"2.5rem"});
                }
            }
            $("#guesses").append(this.value + " ");
                    
            if(correctGuesses == winLength) {
                $("#guess").off("keyup");

                let playagain = prompt("You Won!!! \n" +
                "Want to play again?");
                
                if(playagain.toLowerCase() == "yes" || playagain.toLowerCase() == "y") {
                    initializeAndPickWord();
                }
                else {
                    alert("Goodbye!");
                }
            
                return;
            }

            if(noMatch) {
                //Wrong guess
                incorrectGuesses++;
                image_container.css({"background-image":"url('/assets/images/" + incorrectGuesses + ".jpg')",
                "background-size":"25% 75%", "background-repeat":"no-repeat", "background-position":"center center"});
                $("img").css("background");

                if(incorrectGuesses == 10) {
                    $("#guess").off("keyup");
                    alert("You Lose! The word was: " + word);
                    initializeAndPickWord();
                    return;
                }
            }
            else{
                successes += this.value;
                $("#guess").value = '';
            }
        }
    }
}

$(document).ready(
    function () {
        initializeAndPickWord();
    
    });
