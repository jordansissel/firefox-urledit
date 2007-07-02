function urledit_editor_init() {
  var urledit = window.arguments[0];
  urledit._editwin = window;
  window._urledit = urledit;
  urledit.editor_onload();
}

function urledit_editor_add() {
  var urledit = window._urledit;

  if (!urledit) {
    alert("window._urledit undefined. Something's broken");
    return;
  }

  var key = prompt("Variable name:");
  var val = prompt("Value (leave blank for none):");

  urledit.editor_add(key, val);

}

function urledit_editor_del() { 
  var urledit = window._urledit;

  if (!urledit) {
    alert("window._urledit undefined. Something's broken");
    return;
  }

  var tree = window.document.getElementById("urledit-tree");
  urledit.editor_del(tree.currentIndex);
  var treechildren = tree.getElementsByTagName("treechildren")[0];
  treechildren.removeChild(treechildren.childNodes[tree.currentIndex]);
}

function urledit_editor_mod() { 
  var urledit = window._urledit;

  if (!urledit) {
    alert("window._urledit undefined. Something's broken");
    return;
  }

  var tree = window.document.getElementById("urledit-tree");
  urledit.editor_mod(tree.currentIndex);
}

window.addEventListener("load", urledit_editor_init, false);
