function mkxul(elname) {
  return document.createElementNS(XUL_NS, elname);
}

function urledit_onload() {
    this.initialized = true;
    this.strings = document.getElementById("urledit-strings");

    var urlbar = document.getElementById("urlbar");
    var urltextbox = document.getAnonymousElementByAttribute(urlbar, "anonid", "textbox-input-box");
    var cxmenu = document.getAnonymousElementByAttribute(urltextbox, "anonid", "input-box-contextmenu");

    this.urlbar = urlbar;
    this.urltextbox = urltextbox
    this.cxmenu = cxmenu;

    var el = document.createElementNS(XUL_NS, "menuseparator");
    cxmenu.appendChild(el);
    el = document.createElementNS(XUL_NS, "menuitem");
    var label = this.strings.getString("extensions.urledit.context_menu_label");
    //var akey = this.strings.getString("cmd_editurl_accesskey");
    el.setAttribute("label", label);
    el.setAttribute("oncommand", "new UrlEdit()");
    cxmenu.appendChild(el);
}

function UrlEdit() {
  //this._urlbar = urlbar;
  this._urlbar = window.document.getElementById("urlbar");
  if (! this._urlbar) {
    alert("No urlbar found on this window?");
    return 0;
  }

  this.open_editor();
}

UrlEdit.prototype = {
  _urlbar: null,

  debug: function(val) {
    dump(val);
  },

  open_editor: function() {
    var win;

    var val = this._urlbar.value;
    var spliturl = val.split("?", 2);
    if (spliturl.length == 1) {
      alert("URL is not worth editing: no cgi params in url");
      return;
    } 

    this._browserwin = window;
    var retval = { newurl: undefined };
    window.openDialog("chrome://urledit/content/editwin.xul", 
                      "URL Editor", "modal",
                      this);

  },

  editor_onload: function() {
    this.editor_populate();
  },

  editor_populate: function() {
    var val = this._urlbar.value;
    var spliturl = val.split("?", 2);
    if (spliturl.length == 1)
      window.close();
    
    var uripath = spliturl[0];
    var query = spliturl[1].split("&");
    var arg_re = /^([^=]+)=(.*)$/;

    var listbox = this._editwin.document.getElementById("urledit-listbox");
    for (var i = 0; i < query.length; i++) {
      var m = arg_re.exec(query[i]);
      var keystr = (m && m[1]) || query[i];
      var valstr = (m && unescape(m[2])) || "";
      valstr = valstr.replace(/\+/g, " ");

      var li = mkxul("listitem");
      var key = mkxul("listcell");
      var val = mkxul("listcell");
      key.setAttribute("label", keystr);
      val.setAttribute("label", valstr);
      li.appendChild(key);
      li.appendChild(val);
      listbox.appendChild(li);
    }
  },
};

window.addEventListener("load", function(e) { urledit_onload(e); }, false);
