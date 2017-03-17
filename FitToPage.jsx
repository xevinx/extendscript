//FitToPage.jsx
//An InDesign JavaScript
/*  
@@@BUILDINFO@@@ "FitToPage.jsx" 0.0.0 16 March 2017
*/
//Resizes the items in the selection to fit the page.
//
//Author: Kevin G Phillips
//
main();
function main(){    
    //Make certain that user interaction (display of dialogs, etc.) is turned on.
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
	var objectList = new Array();
	if (app.documents.length != 0){
		if (app.selection.length != 0){
			for(var i= 0; i < app.selection.length; i++){
				switch (app.selection[i].constructor.name){ 
					case "Rectangle":
					case "Oval":
					case "Polygon":
					case "TextFrame":
					case "Group":
					case "Button":
					case "GraphicLine":
                           objectList.push(app.selection[i]);
                           break;
				}
			}
			if (objectList.length != 0){
                dialogDisplay(objectList);
             }
			else{
				alert ("Please select a page item and try again.");
			}
		}
		else{
			alert ("Please select an object and try again.");
		}
	}
	else{
 	   alert ("Please open a document, select an object, and try again.");
	}
}

function dialogDisplay(objectList){
	var dialog = app.dialogs.add({name:"Fit to Page"});
	with(dialog.dialogColumns.add()){
		with(dialogRows.add()){
			with(dialogColumns.add()){
				with(borderPanels.add()){
					staticTexts.add({staticLabel:"Fit Direction"});
					var myVerticalAlignmentButtons = radiobuttonGroups.add();
					with(myVerticalAlignmentButtons){
						radiobuttonControls.add({staticLabel:"Fit Horizontally", checkedState: true});
						radiobuttonControls.add({staticLabel:"Fit Vertically"});
					}
				}
			}
		}
	}
	var myResult = dialog.show();
	if(myResult == true){
        var selectedOption = myVerticalAlignmentButtons.selectedButton;
		dialog.destroy();
         fitToScreen(objectList, selectedOption);
	}
	else{
		dialog.destroy();
	}
}


function fitToScreen(objectList, option) {
        var pageHeight = app.activeDocument.documentPreferences.pageHeight;
        var pageWidth = app.activeDocument.documentPreferences.pageWidth;
        var totalWidth = 0;
        var totalHeight = 0;
        for(var i = 0; i < objectList.length; i++) {
            var obj = objectList[i];
            // before we attempt to get the height or width of the object, scale it back to 100%
            obj.resize(CoordinateSpaces.INNER_COORDINATES, AnchorPoint.CENTER_ANCHOR, ResizeMethods.MULTIPLYING_CURRENT_DIMENSIONS_BY, [1, 1]);
            // get the total width of the selected objects
            var objBounds = obj.geometricBounds;
            var objWidth = objBounds[3] - objBounds[1];
            var objHeight = objBounds[2] - objBounds[0];
            totalWidth = objWidth > 0 ? totalWidth + objWidth : totalWidth;
            totalHeight = objWidth > 0 ? totalHeight + objHeight : totalHeight;
        }
        // now that we have the total width, get a percentage compared to the page width
        var percentage = option === 0 ? pageWidth / totalWidth : pageHeight / totalHeight;
        // keep track of horizontal positions of each item
        var newPosition = 0;
        // now resize each item by that percentage and repositon
        for(var n = 0; n < objectList.length; n++) {
            var obj = objectList[n];
            obj.resize(CoordinateSpaces.INNER_COORDINATES, AnchorPoint.CENTER_ANCHOR, ResizeMethods.MULTIPLYING_CURRENT_DIMENSIONS_BY, [percentage, percentage]);
            var objBounds = obj.geometricBounds;
            var objWidth = objBounds[3] - objBounds[1];
            var objHeight = objBounds[2] - objBounds[0];
            // now position each item next to each other, depending on if horizontal or vertical
            obj.move([option === 0 ? newPosition : 0, option === 1 ? newPosition: 0]);
            newPosition = option === 0 ? newPosition + objWidth : newPosition + objHeight;
        }
}