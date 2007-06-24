function mkxul(elname) {
  return document.createElementNS(XUL_NS, elname);
}

var urledit = {
  onLoad: function() {
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
    //el.setAttribute("oncommand", "urledit.edit_url()");
    el.setAttribute("oncommand", "toggleSidebar('urledit-sidebar');");
    cxmenu.appendChild(el);
  },

  debug: function(val) {
    dump(val);
  },

  edit_url: function() {
    window.open("chrome://urledit/content/editwin.xul", "Edit URL", "toolbar=no,menubar=no,location=no");
  },
};

window.addEventListener("load", function(e) { urledit.onLoad(e); }, false);
