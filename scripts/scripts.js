//Constants
const DEFAULT_TEXT_COLOR = "#00FF00";
const DEFAULT_BACKGROUND_COLOR = "#000000";
const DEFAULT_FONT_SIZE = 20;
const DEFAULT_DOCUMENT_NAME = "New Document";

const TEXT_COLOR_PARAMETER = "txtcol";
const BACKGROUND_COLOR_PARAMETER = "bgcol";
const FONT_SIZE_PARAMETER = "fntsize";

const SMALLEST_FONT = 1;
const LARGEST_FONT = 200;

/*
This function sets initial value for format settings and runs an initialization code needed.
*/
function initialize()
{
    //Get input elements
    var documentNameInput = document.getElementById("document-name-input");
    var textColorPicker = document.getElementById("text-color-picker");
    var backgroundColorPicker = document.getElementById("background-color-picker");
    var body = document.getElementsByTagName("body")[0];
    var fontSizePicker = document.getElementById("font-size-picker");

    //Get text area
    var textArea = document.getElementById("text-area");

    //Get URL parameters
    const CURRENT_URL = new URL(window.location.href);
    const URL_PARAMETERS = new URLSearchParams(CURRENT_URL.searchParams);

    //If there are no query paramters, determine how to load format settings
    if (!URL_PARAMETERS.has(TEXT_COLOR_PARAMETER))
    {
        //Check for first load
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
            //Set the settings for the text areas
            textArea.style.color = textColorPicker.value;
            textArea.style.backgroundColor = backgroundColorPicker.value;
            body.style.backgroundColor = backgroundColorPicker.value;
            textArea.style.fontSize = fontSizePicker.value + "px";
        }
    }
    //If there are URL parameters, set the format settings
    else
    {
        //Get values from URL parameters
        const TEXT_COLOR = URL_PARAMETERS.get(TEXT_COLOR_PARAMETER);
        const BACKGROUND_COLOR = URL_PARAMETERS.get(BACKGROUND_COLOR_PARAMETER);
        const FONT_SIZE = URL_PARAMETERS.get(FONT_SIZE_PARAMETER);

        console.log(CURRENT_URL);
        console.log(URL_PARAMETERS);
        console.log(TEXT_COLOR);
        console.log(BACKGROUND_COLOR);
        console.log(FONT_SIZE)

        //Assign page settings
        //Set the settings for the text areas
        textArea.style.color = TEXT_COLOR;
        textArea.style.backgroundColor = BACKGROUND_COLOR;
        body.style.backgroundColor = BACKGROUND_COLOR;
        textArea.style.fontSize = FONT_SIZE + "px";

        //Change color pickers and font size picker values
        textColorPicker.value = TEXT_COLOR;
        backgroundColorPicker.value = BACKGROUND_COLOR;
        fontSizePicker.value = parseInt(FONT_SIZE);
    }

    //Set document name input to default value; page title will remain defaul "Net Pad" until user changes it
    documentNameInput.value = DEFAULT_DOCUMENT_NAME;
}

function confirmLeave()
{
    var confirmStatus = confirm("Are you sure you want to leave the page? Unsaved data will be lost.");
    return confirmStatus;
}

/*
Set the title of the webpage to the string typed into the document name input.
*/
function setTitleText()
{
    //Get the text from the input box
    const DOCUMENT_NAME = document.getElementById("document-name-input").value;

    //Set the page title
    document.title = DOCUMENT_NAME;
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
    const URL = "https://jackcsheehan.github.io/net-pad/index.html" + QUERY_STRING;

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

function updateHTMLDisplay()
{
    //Get the HTML display
    var HTMLDisplay = document.getElementById("HTML-display-area");

    //If the HTML display exists, put the text inside the text area into this element
    if (HTMLDisplay != null)
    {  
        var iframeDocument = HTMLDisplay.contentWindow.document;

        //Replace the inner HTML of the iframe with the inner HTML of the text area
        iframeDocument.open();
        iframeDocument.write(document.getElementById("text-area").value);
        console.log(document.getElementById("text-area").value);
        iframeDocument.close();
    }
}

/*
This function toggles the live HTML display.
*/
function toggleHTMLEditor()
{
    const CHECKBOX = document.getElementById("html-editor-checkbox");

    //If the box is checked, add the iframe to the page
    if (CHECKBOX.checked == true)
    {
        //Create iFrame where HTML will be rendered
        var HTMLDisplayFrame = document.createElement("iframe");
        HTMLDisplayFrame.id = "HTML-display-area";

        //Adjust the size of the text area to 50%
        document.getElementById("text-area").style.width = "50%";

        //Append the iframe to the body div
        document.getElementById("editing-area").appendChild(HTMLDisplayFrame);
        
    }
    else
    {
        //Remove the HTML display area
        var HTMLDisplayFrame = document.getElementById("HTML-display-area");
        document.getElementById("editing-area").removeChild(HTMLDisplayFrame);

        //Adjust the size of the text area back to 100%
        document.getElementById("text-area").style.width = "100%";
    }
}