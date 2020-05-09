//Constants
const DEFAULT_TEXT_COLOR = "#00FF00";
const DEFAULT_BACKGROUND_COLOR = "#000000";
const DEFAULT_FONT_SIZE = 20;

const TEXT_COLOR_PARAMETER = "txt-col";
const BACKGROUND_COLOR_PARAMETER = "bg-col";
const FONT_SIZE_PARAMETER = "fnt-size";

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
    var body = document.getElementsByTagName("body")[0];
    var fontSizePicker = document.getElementById("font-size-picker");

    //Get URL parameters
    const URL_QUERY = window.location.search;
    const URL_PARAMETERS = new URLSearchParams(URL_QUERY);

    //First, check for first load
    if (localStorage.getItem("hasCodeRunBefore") === null)
    {
        //If there are no paramters (indicated by the presense of no text-color parameter), load default values
        if (!URL_PARAMETERS.has(TEXT_COLOR_PARAMETER))
        {
            //Set text color picker default value
            textColorPicker.value = DEFAULT_TEXT_COLOR;  //Default color is lime

            //Set background color picker default value
            backgroundColorPicker.value = DEFAULT_BACKGROUND_COLOR;

            //Set text size color picker default value
            fontSizePicker.value = DEFAULT_FONT_SIZE;
        }
        //If ther are parameters, read parameter values and assign settings
        else
        {
            //Get values from URL parameters
            const TEXT_COLOR = URL_PARAMETERS.get(TEXT_COLOR_PARAMETER);
            const BACKGROUND_COLOR = URL_PARAMETERS.get(BACKGROUND_COLOR_PARAMETER);
            const FONT_SIZE = URL_PARAMETERS.get(FONT_SIZE_PARAMETER);

            //Assign page settings
            //Set the settings for the text areas
            textArea.style.color = TEXT_COLOR;
            textArea.style.backgroundColor = BACKGROUND_COLOR;
            body.style.backgroundColor = BACKGROUND_COLOR;
            textArea.style.fontSize = FONT_SIZE + "px";
        }

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
        body.style.backgroundColor = backgroundColorPicker.value;
        textArea.style.fontSize = fontSizePicker.value + "px";
    }
}

function confirmLeave()
{
    var confirmStatus = confirm("Are you sure you want to leave the page? Unsaved data will be lost.");
    return confirmStatus;
}

/*
Opens a new Net Pad tab.
*/
function newTab()
{
    //Gather data from web page
    const TEXT_COLOR = document.getElementById("text-color-picker").value;
    const BACKGROUND_COLOR = document.getElementById("background-color-picker").value;
    const FONT_SIZE = document.getElementById("font-size-picker").value;

    //Create a custom query string that indicates the user's format settings
    const QUERY_STRING = "?" + TEXT_COLOR_PARAMETER + "=" + TEXT_COLOR + "&"
                             + BACKGROUND_COLOR_PARAMETER + "=" + BACKGROUND_COLOR + "&"
                             + FONT_SIZE_PARAMETER + "=" + FONT_SIZE;

    //Create URL based on custom query string
    const URL = "https://jackcsheehan.github.io/net-pad/" + QUERY_STRING;

    window.open(URL);
}

/*
This function sets the text color of the main text area to the color set in the color picker.
*/
function setTextColor()
{
    //Get the color selected in the color picker
    const COLOR_PICKER = document.getElementById("text-color-picker");
    var selectedColor = COLOR_PICKER.value;
    
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
    const COLOR_PICKER = document.getElementById("background-color-picker");
    var selectedColor = COLOR_PICKER.value;
    
    //Set the background color of the main text area to that color
    var textArea = document.getElementById("text-area");
    var body = document.getElementsByTagName("body")[0];

    textArea.style.backgroundColor = selectedColor;
    body.style.backgroundColor = selectedColor;
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