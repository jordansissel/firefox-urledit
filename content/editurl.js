var XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

function mkxul(elname) {
  return document.createElementNS(XUL_NS, elname);
}

var urledit_win = {
  onLoad: function() {
    var urlbar = mainWindow.document.getElementById("urlbar");
    var val = urlbar.value;
    var spliturl = val.split("?", 2);
    if (spliturl.length == 1) {
      alert("Nothing worth editing (No cgi params in url)");
      window.close();
      return;
    }

    var uripath = spliturl[0];
    var query = spliturl[1].split("&");

    var listbox = document.getElementById("urledit-listbox");
    for (var i = 0; i < query.length; i++) {
      var kv = query[i].split("=", 2);
      var li = mkxul("listitem");
      var key = mkxul("listcell");
      var val = mkxul("listcell");
      key.setAttribute("label", kv[0]);
      val.setAttribute("label", kv[1]);
      li.appendChild(key);
      li.appendChild(val);
      listbox.appendChild(li);
    }
  },
};

alert("urledit go");
window.addEventListener("load", function(e) { urledit_win.onLoad(e); }, false);
//urledit_win.onLoad();
