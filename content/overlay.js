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
    window.openDialog("chrome://urledit/content/editwin.xul", 
                            "URL Editor", "modal",
                            this);

  },

  editor_onload: function() {
    var tree = this._editwin.document.getElementById("urledit-tree");
    var _urledit = this;
    tree.addEventListener("click", function(e) { 
      /* Doubleclick on left button */
      if (e.detail == 2 && e.button == 0) {
        var cmd = _urledit._editwin.document.getElementById("urledit-cmd-mod");
        cmd.doCommand();
      }
    }, false);
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

    for (var i = 0; i < query.length; i++) {
      var m = arg_re.exec(query[i]);
      var keystr = query[i];
      var valstr = "";

      if (m) {
        keystr = (m && m[1]) || query[i];
        valstr = (m && unescape(m[2])) || "";
        valstr = valstr.replace(/\+/g, " ");
      }

      if (keystr)
        this.editor_add(keystr, valstr);
    }
  },

  editor_add: function(keystr, valstr) {
    var tree = this._editwin.document.getElementById("urledit-treechildren");
    var ti = mkxul("treeitem");
    var tr = mkxul("treerow");
    var key = mkxul("treecell");
    var val = mkxul("treecell");
    key.setAttribute("label", keystr);
    val.setAttribute("label", valstr);
    tr.appendChild(key);
    tr.appendChild(val);
    ti.appendChild(tr);

    /* Figure out where in the tree to insert this item */
    var lowcase_keystr = keystr.toLowerCase();
    var items = tree.getElementsByTagName("treeitem");
    for (var i = 0; i < items.length; i++) {
      // treeitem/treerow/treecell[0]
      var item_key = items[i].childNodes[0].childNodes[0].getAttribute("label");
      if (item_key.toLowerCase() > lowcase_keystr) {
        tree.insertBefore(ti, items[i]);
        return;
      }
    }
    tree.appendChild(ti);
  },

  editor_del: function(index) {
    var tree = this._editwin.document.getElementById("urledit-tree");
    var treechildren = tree.getElementsByTagName("treechildren")[0];
    treechildren.removeChild(treechildren.childNodes[index]);
  },

  editor_mod: function(index) {
    var tree = this._editwin.document.getElementById("urledit-tree");
    var treechildren = tree.getElementsByTagName("treechildren")[0];
    var treeitem = treechildren.childNodes[index];

    // Get the value
    var valuecell = treeitem.childNodes[0].childNodes[1];
    var valuestr = valuecell.getAttribute("label");
    valuestr = prompt("New value:", valuestr);
    if (valuestr)
      valuecell.setAttribute("label", valuestr);
  },

  editor_writeurl: function() {
    var tree = this._editwin.document.getElementById("urledit-tree");
    var treechildren = tree.getElementsByTagName("treechildren")[0];

    var query = "";
    
    for (var i = 0; i < treechildren.childNodes.length; i++) {
      var tr = treechildren.childNodes[i].childNodes[0];
      var keystr = tr.childNodes[0].getAttribute("label");
      var valuestr = tr.childNodes[1].getAttribute("label");
      query += keystr;
      if (valuestr)
        query += "=" + escape(valuestr);
      query += "&";
    }

    var hostpath = this._urlbar.value.split("?")[0];

    this._urlbar.value = hostpath + "?" + query;
  },


};

window.addEventListener("load", function(e) { urledit_onload(e); }, false);
