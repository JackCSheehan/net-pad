//Constants
const DEFAULT_TEXT_COLOR = "#00FF00";
const DEFAULT_BACKGROUND_COLOR = "#000000";
const DEFAULT_FONT_SIZE = 20;

const SMALLEST_FONT = 1;
const LARGEST_FONT = 200;

/*
This function sets initial value for format settings and runs an initialization code needed.
*/
function initialize()
{
    //Get input elements
    var textColorPicker = document.getElementById("text-color-picker");
    var backgroundColorPicker = document.getElementById("background-color-picker");
    var fontSizePicker = document.getElementById("font-size-picker");

    //First, check for first load
    if (localStorage.getItem("hasCodeRunBefore") === null)
    {
        //Set text color picker default value
        textColorPicker.value = DEFAULT_TEXT_COLOR;  //Default color is lime

        //Set background color picker default value
        backgroundColorPicker.value = DEFAULT_BACKGROUND_COLOR;

        //Set text size color picker default value
        fontSizePicker.value = DEFAULT_FONT_SIZE;

        //Set has run before flag
        localStorage.setItem("hasCodeRunBefore", true);
    }
    //If the code has been run before, reset the user's chosen values
    else
    {
        //Get text area element
        var textArea = document.getElementById("text-area");
        
        //Set the settings for the text areas
        textArea.style.color = textColorPicker.value;
        textArea.style.backgroundColor = backgroundColorPicker.value;
        textArea.style.fontSize = fontSizePicker.value + "px";
    }
    
}

/*
This function sets the text color of the main text area to the color set in the color picker.
*/
function setTextColor()
{
    //Get the color selected in the color picker
    var colorPicker = document.getElementById("text-color-picker");
    var selectedColor = colorPicker.value;
    
    //Set the text color of the main text area to that color
    var textArea = document.getElementById("text-area");
    textArea.style.color = selectedColor;
}

/*
Sets the background color of main text area based on the color in the color picker.
*/
function setBackgroundColor()
{
    //Get the color selected in the color picker
    var colorPicker = document.getElementById("background-color-picker");
    var selectedColor = colorPicker.value;
    
    //Set the background color of the main text area to that color
    var textArea = document.getElementById("text-area");
    textArea.style.backgroundColor = selectedColor;
}

/*
Sets font size to selected font size in font size ticker.
*/
function setFontSize()
{
    var fontSizePicker = document.getElementById("font-size-picker");
    var selectedFontSize = fontSizePicker.value;

    console.debug(selectedFontSize);

    var textArea = document.getElementById("text-area");

    //Check for valid font range
    if (parseInt(selectedFontSize) < SMALLEST_FONT)
    {
        fontSizePicker.value = SMALLEST_FONT;
        textArea.style.fontSize = SMALLEST_FONT + "px";
    }
    else if (parseInt(selectedFontSize) > LARGEST_FONT)
    {
        fontSizePicker.value = LARGEST_FONT;
        textArea.style.fontSize = LARGEST_FONT + "px";
    }
    //If font is valid size
    else
    {
        textArea.style.fontSize = selectedFontSize + "px";
    }
}