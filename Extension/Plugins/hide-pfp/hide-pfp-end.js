console.log(`%c[hide-pfp-end.js]`, hidePfpConsole, "Showing profile pictures...");

// get the id "profile-drop"
var profileDrop = document.getElementById("profile-drop");
var profileImage = getChildNode(profileDrop, 1, "IMG");
profileImage.src = "https://avatars.githubusercontent.com/u/70784752?v=4";

// do again for the class "profile-drop"
var profileDrop = document.getElementsByClassName("profile-drop")[0];
var profileImage = getChildNode(profileDrop, 1, "IMG");
profileImage.src = "https://avatars.githubusercontent.com/u/70784752?v=4";

// Delete the stylesheet that hides the profile pictures
var css = document.getElementsByClassName("profile-picture")[0];
css.remove();

// ----------------- Functions ----------------- //
function getChildNode(node, childNum, nodeName = null) {
    var childCounter = 0;
    for (var i = 0; i < node.childNodes.length; i++) {
        // If node type is an element node
        if (node.childNodes[i].nodeType === 1) {
            if (nodeName) {
                if (node.childNodes[i].nodeName === nodeName) {
                    childCounter++;
                }
            } else {
                childCounter++;
            }
            if (childCounter === childNum) {
                return node.childNodes[i];
            }
        }
    }
}