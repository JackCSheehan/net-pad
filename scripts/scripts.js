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

//Define static map used to auto fill code separators
const SEPARATOR_CHARACTERS = [["(", ")"], ["[", "]"], ["{", "}"], ["<", ">"], ["\"", "\""], ["/*", "*/"], ["'", "'"]];
const SEPARATOR_MAP = new Map(SEPARATOR_CHARACTERS);

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
    var URLParameters = getQueryParameters();

    //If there are no query parameters, determine how to load format settings
    if (URLParameters === null)
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
        var textColor = URLParameters.get(TEXT_COLOR_PARAMETER);
        var backgroundColor = URLParameters.get(BACKGROUND_COLOR_PARAMETER);
        var fontSize = URLParameters.get(FONT_SIZE_PARAMETER);

        //Assign page settings
        //Set the settings for the text areas
        textArea.style.color = textColor;
        textArea.style.backgroundColor = backgroundColor;
        body.style.backgroundColor = backgroundColor;
        textArea.style.fontSize = fontSize + "px";

        //Change color pickers and font size picker values
        textColorPicker.value = textColor;
        backgroundColorPicker.value = backgroundColor;
        fontSizePicker.value = parseInt(fontSize);
    }

    //Set document name input to default value; page title will remain default "Net Pad" until user changes it
    documentNameInput.value = DEFAULT_DOCUMENT_NAME;

    //Uncheck HTML editor and code completion checkboxes
    document.getElementById("html-editor-checkbox").checked = false;
    //document.getElementById("code-separator-completion-checkbox").checked = false;

    //Add event listeners for text area utilities
    textArea.addEventListener("keyup", updateHTMLDisplay);
    textArea.addEventListener("keydown", checkForCodeCompletion);
    textArea.addEventListener("keydown", checkForTabKey);

    //Add event listener for the format options dropdown box
    document.getElementById("format-options-dropdown-button").addEventListener("click", function()
    {
        dropdown("format-dropdown-items");
    });

    //Add event listner for coding options dropdown box
    document.getElementById("coding-options-dropdown-button").addEventListener("click", function()
    {
        dropdown("coding-dropdown-items");
    });

}

/*
This function gets the query parameters from the current URL and returns a map of type paramter : value.
*/
function getQueryParameters()
{
    var parameters = new Map();             //Map of parsed parameters
    var currentURL = window.location.href;  //Current URL of page
    var splitURL;                           //The URL split at "?"
    var unparsedParameters;                 //The parameters that have yet to be parsed from the URL
    var splitParameters;                    //Parameters split at the "&"

    //Split the URL at the "?" marker
    splitURL = currentURL.split("?")

    //If there are parameters to parse, then parse them
    if (splitURL.length > 1)
    {
        unparsedParameters = splitURL[1];

        //Split parameters at the "&" separator
        splitParameters = unparsedParameters.split("&");

        //Iterate through each parameter and value in the split parameters and add them to the map
        try
        {
            for (var counter = 0; counter < splitParameters.length; counter++)
            {
                //Split current parameter at the "=" to distinguish between paramter and value
                var currentParameter = splitParameters[counter].split("=");
                console.debug(currentParameter);
                //Add the parameter and value to the map
                parameters.set(currentParameter[0], currentParameter[1]);
            }
        }
        //If there is an incomplete paramter, print the error to the console
        catch (error)
        {
            console.error("Incomplete Parameter");
        }
    }
    //If there aren't parameters to parse, return null
    else
    {
        return null;
    }

    return parameters;
}

/*
Call when user tries to exit page.
*/
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
    var TEXT_COLOR = document.getElementById("text-color-picker").value;
    var BACKGROUND_COLOR = document.getElementById("background-color-picker").value;
    var FONT_SIZE = document.getElementById("font-size-picker").value;

    //Create a custom query string that indicates the user's format settings
    const QUERY_STRING = "?" + TEXT_COLOR_PARAMETER + "=" + TEXT_COLOR + "&"
                             + BACKGROUND_COLOR_PARAMETER + "=" + BACKGROUND_COLOR + "&"
                             + FONT_SIZE_PARAMETER + "=" + FONT_SIZE;

    //Create URL based on custom query string
    const URL = "https://jackcsheehan.github.io/net-pad/index.html" + QUERY_STRING;

    window.open(URL);
}

/*
This function saves the text in the text area to a file on the user's machine
*/
function saveTextAreaToFile()
{
    //Get text area text
    var text = document.getElementById("text-area").value;

    //Get name of file from the text box
    var fileName = document.getElementById("document-name-input").value;

    //Create a blob to save the data
    var blob = new Blob([text], {type : "text/plain"});
    
    //Create a link to download the file
    var downloadElement = document.createElement("a");

    //Creat URL from blob
    downloadElement.href = window.URL.createObjectURL(blob);

    //Set the download to the generated file name
    downloadElement.download = fileName;
    
    //So no new window appears
    downloadElement.target = "_blank";

    //Append child, click the linnk, remove the child
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
}

/*
This function prompts the user with a file chooser and let's them upload a file whose contents will be put into 
the text area.
*/
function uploadFile()
{
    //Create an input element
    var inputElement = document.createElement("input");
    inputElement.setAttribute("type", "file");

    //Add the file, click it, remove it
    document.body.appendChild(inputElement);
    inputElement.click();
    

    //Wait for the user to enter their file before trying to get the files from it
    inputElement.onchange = function()
    {
        //Get the files that the user entered and then get only the first one
        var file = inputElement.files[0];

        //Get the name of the file and set it to the document name element value
        document.getElementById("document-name-input").value = file.name;

        //Get the contents of the file as a promise
        var fileTextPromise = file.text();

        //Once the promise is filled, write the text to the text area
        fileTextPromise.then(function(data)
        {
            //Set the text area to be the text read from the user's file
            document.getElementById("text-area").value = data;
        }); 
    }

    document.body.removeChild(inputElement);
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

/*
Updates the HTML display to show the HTML typed into the text area.
*/
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
        iframeDocument.close();
    }
}

/*
Checks the current character at caret to see if it is a character that can be auto filled.
*/
function checkForCodeCompletion(event)
{
    //Check to make sure the code completion checkbox is checked before trying to complete any code
    if (document.getElementById("code-separator-completion-checkbox").checked === true)
    {
        //If the character just typed is a completable character, complete it
        if (SEPARATOR_MAP.has(event.key))
        {
            //Prevent the keystroke from being printed in the text area
            event.preventDefault();

            //Get text area
            var textArea = document.getElementById("text-area");

            //Get the index of the insertion pointer
            var currentSelectionIndex = textArea.selectionEnd;

            //Get the text in the text area
            var text = textArea.value;

            //Insert beginning of text area, beginning separator, ending seperator, and end of text area
            textArea.value = text.substring(0, currentSelectionIndex) + event.key + SEPARATOR_MAP.get(event.key) + text.substring(currentSelectionIndex, text.length);

            //Move caret back one character
            textArea.selectionEnd = currentSelectionIndex + 1;
        }
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
        
        //Update the display so the user doesn't have to press a key to update it
        updateHTMLDisplay();

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

/*
If the user presses the tab key, this function will refocus the text area and move the caret forward by a tab character.
*/
function checkForTabKey(event)
{
    //If the key pressed was the tab key, append a \t to the text area
    if (event.which === 9)
    {
        //Prevent tab from tabbing to next element
        event.preventDefault();

        //Get text area
        var textArea = document.getElementById("text-area");

        //Get the index of the insertion pointer
        var currentSelectionIndex = textArea.selectionStart;

        //Get text area text
        var text = textArea.value;

        //Insert beginning of text area, insert \t, insert end of text area
        textArea.value = text.substring(0, currentSelectionIndex) + "\t" + text.substring(currentSelectionIndex, text.length);
    
        //Move caret back one character
        textArea.selectionEnd = currentSelectionIndex + 1;
    }
}

/*
This function takes the ID of the dropdown items and sets their display so that the menu is displayed.
*/
function dropdown(dropdownItemsId)
{
    //Get dropdown
    var dropdownItems = document.getElementById(dropdownItemsId);

    //Check current state of dropdown to toggle it
    if (dropdownItems.style.display === "none")
    {
        dropdownItems.style.display = "block";
    }
    else
    {
        dropdownItems.style.display = "none";
    }
}