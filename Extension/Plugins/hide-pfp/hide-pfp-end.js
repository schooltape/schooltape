// get the id "profile-drop"
let profileDrop = document.getElementById("profile-drop");
let profileImage = getChildNode(profileDrop, 1, "IMG");
// change image source to /Assets/guest.png
profileImage.src = chrome.runtime.getURL("Assets/guest.png");

// do again for the class "profile-drop"
profileDrop = document.getElementsByClassName("profile-drop")[0];
profileImage = getChildNode(profileDrop, 1, "IMG");
profileImage.src = chrome.runtime.getURL("Assets/guest.png");

// Delete the stylesheet that hides the profile pictures
css = document.getElementsByClassName("profile-picture")[0];
css.remove();

// ----------------- Functions ----------------- //
function getChildNode(node, childNum, nodeName = null) {
    let childCounter = 0;
    for (let i = 0; i < node.childNodes.length; i++) {
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