// Generated by CoffeeScript 1.6.1
var Mini, WSF_AUTOCOMPLETE_CONTROL, WSF_BUTTON_CONTROL, WSF_CHECKBOX_CONTROL, WSF_CHECKBOX_LIST_CONTROL, WSF_CODEVIEW_CONTROL, WSF_CONTROL, WSF_DROPDOWN_CONTROL, WSF_FILE_CONTROL, WSF_FORM_ELEMENT_CONTROL, WSF_GRID_CONTROL, WSF_HTML_CONTROL, WSF_INPUT_CONTROL, WSF_MAX_VALIDATOR, WSF_MIN_VALIDATOR, WSF_NAVLIST_ITEM_CONTROL, WSF_PAGE_CONTROL, WSF_PAGINATION_CONTROL, WSF_PASSWORD_CONTROL, WSF_PROGRESS_CONTROL, WSF_REGEXP_VALIDATOR, WSF_REPEATER_CONTROL, WSF_SLIDER_CONTROL, WSF_TEXTAREA_CONTROL, WSF_VALIDATOR, build_control, cache, controls, lazy_load, loaded, parseSuggestions, redirect, show_alert, start_modal, start_modal_big, template, tmpl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cache = {};

jQuery.cachedAsset = function(url, options) {
  var head, onload, script, success, successful, timeoutHandle;
  if (/\.css$/.test(url)) {
    $("<link/>", {
      rel: "stylesheet",
      type: "text/css",
      href: url
    }).appendTo("head");
    return {
      done: function(fn) {
        return fn();
      }
    };
  } else {
    success = [];
    head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
    script = document.createElement('script');
    script.async = 'async';
    script.src = url;
    successful = false;
    onload = function(_, aborted) {
      var s, _i, _len;
      if (aborted == null) {
        aborted = false;
      }
      if (!(aborted || !script.readyState || script.readyState === 'complete')) {
        return;
      }
      clearTimeout(timeoutHandle);
      script.onload = script.onreadystatechange = script.onerror = null;
      if (head && script.parentNode) {
        head.removeChild(script);
      }
      script = void 0;
      if (success && !aborted) {
        successful = true;
        for (_i = 0, _len = success.length; _i < _len; _i++) {
          s = success[_i];
          s();
        }
        return success = [];
      }
    };
    script.onload = script.onreadystatechange = onload;
    script.onerror = function() {
      return onload(null, true);
    };
    timeoutHandle = setTimeout(script.onerror, 7500);
    head.insertBefore(script, head.firstChild);
    return {
      done: function(fn) {
        if (!successful) {
          success.push(fn);
        } else {
          fn();
        }
      }
    };
  }
};

jQuery.unparam = function(value) {
  var i, l, pair, params, pieces;
  params = {};
  pieces = value.split("&");
  pair = void 0;
  i = void 0;
  l = void 0;
  i = 0;
  l = pieces.length;
  while (i < l) {
    pair = pieces[i].split("=", 2);
    params[decodeURIComponent(pair[0])] = (pair.length === 2 ? decodeURIComponent(pair[1].replace(/\+/g, " ")) : true);
    i++;
  }
  return params;
};

template = tmpl = function(str, data) {
  var fn;
  fn = (!/\W/.test(str) ? cache[str] = cache[str] || tmpl(str) : new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" + "with(obj){p.push('" + str.replace(/[\r\t\n]/g, " ").split("{{").join("\t").replace(/((^|}})[^\t]*)'/g, "$1\r").replace(/\t=(.*?)}}/g, "',$1,'").split("\t").join("');").split("}}").join("p.push('").split("\r").join("\\'") + "');}return p.join('');"));
  if (data) {
    return fn(data);
  } else {
    return fn;
  }
};

Mini = {
  compile: function(t) {
    return {
      render: template(t)
    };
  }
};

parseSuggestions = function(data) {
  var a, d;
  for (a in data) {
    if (a === 'suggestions') {
      return data[a];
    } else {
      d = parseSuggestions(data[a]);
      if (d != null) {
        return d;
      }
    }
  }
  return null;
};

loaded = {};

lazy_load = function(requirements, fn, that) {
  if (requirements.length === 0) {
    return function() {
      var a;
      a = arguments;
      return fn.apply(that, a);
    };
  }
  if (that == null) {
    that = window;
  }
  return function() {
    var a, args, counter, done, r, self, _i, _len;
    a = arguments;
    if (typeof args === "undefined" || args === null) {
      args = [];
    }
    counter = requirements.length + 1;
    self = this;
    done = function() {
      counter = counter - 1;
      if (counter === 0) {
        fn.apply(that, a);
      }
    };
    for (_i = 0, _len = requirements.length; _i < _len; _i++) {
      r = requirements[_i];
      if (loaded[r] == null) {
        loaded[r] = $.cachedAsset(r);
      }
      loaded[r].done(done);
    }
    return done();
  };
};

build_control = function(control_name, state, control) {
  var $el, type, typeclass;
  $el = control.$el.find('[data-name=' + control_name + ']').first();
  type = $el.data('type');
  typeclass = null;
  try {
    typeclass = eval(type);
  } catch (e) {
    typeclass = WSF_CONTROL;
  }
  if ((type != null) && (typeclass != null)) {
    return new typeclass(control, $el, control_name, state);
  }
  return null;
};

WSF_VALIDATOR = (function() {

  function WSF_VALIDATOR(parent_control, settings) {
    this.parent_control = parent_control;
    this.settings = settings;
    this.error = this.settings.error;
    return;
  }

  WSF_VALIDATOR.prototype.validate = function() {
    return true;
  };

  return WSF_VALIDATOR;

})();

WSF_REGEXP_VALIDATOR = (function(_super) {

  __extends(WSF_REGEXP_VALIDATOR, _super);

  function WSF_REGEXP_VALIDATOR() {
    WSF_REGEXP_VALIDATOR.__super__.constructor.apply(this, arguments);
    this.pattern = new RegExp(this.settings.expression, 'g');
  }

  WSF_REGEXP_VALIDATOR.prototype.validate = function() {
    var res, val;
    val = this.parent_control.value();
    res = val.match(this.pattern);
    return res !== null;
  };

  return WSF_REGEXP_VALIDATOR;

})(WSF_VALIDATOR);

WSF_MIN_VALIDATOR = (function(_super) {

  __extends(WSF_MIN_VALIDATOR, _super);

  function WSF_MIN_VALIDATOR() {
    return WSF_MIN_VALIDATOR.__super__.constructor.apply(this, arguments);
  }

  WSF_MIN_VALIDATOR.prototype.validate = function() {
    var val;
    val = this.parent_control.value();
    return val.length >= this.settings.min;
  };

  return WSF_MIN_VALIDATOR;

})(WSF_VALIDATOR);

WSF_MAX_VALIDATOR = (function(_super) {

  __extends(WSF_MAX_VALIDATOR, _super);

  function WSF_MAX_VALIDATOR() {
    return WSF_MAX_VALIDATOR.__super__.constructor.apply(this, arguments);
  }

  WSF_MAX_VALIDATOR.prototype.validate = function() {
    var val;
    val = this.parent_control.value();
    return val.length <= this.settings.max;
  };

  return WSF_MAX_VALIDATOR;

})(WSF_VALIDATOR);

WSF_CONTROL = (function() {

  WSF_CONTROL.prototype.requirements = [];

  function WSF_CONTROL(parent_control, $el, control_name, fullstate) {
    this.parent_control = parent_control;
    this.$el = $el;
    this.control_name = control_name;
    this.fullstate = fullstate;
    this.state = this.fullstate.state;
    this.load_subcontrols();
    this.isolation = "" + this.$el.data('isolation') === "1";
    this.$el.data('control', this);
    this.initialize = lazy_load(this.requirements, this.attach_events, this);
    return;
  }

  WSF_CONTROL.prototype.load_subcontrols = function() {
    var control_name, state;
    if (this.fullstate.controls != null) {
      return this.controls = (function() {
        var _ref, _results;
        _ref = this.fullstate.controls;
        _results = [];
        for (control_name in _ref) {
          state = _ref[control_name];
          _results.push(build_control(control_name, state, this));
        }
        return _results;
      }).call(this);
    } else {
      return this.controls = [];
    }
  };

  WSF_CONTROL.prototype.attach_events = function() {
    var control, _i, _len, _ref;
    console.log("Attached " + this.control_name);
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      if (control != null) {
        control.initialize();
      }
    }
  };

  WSF_CONTROL.prototype.update = function(state) {};

  WSF_CONTROL.prototype.process_actions = function(actions) {
    var action, fn, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = actions.length; _i < _len; _i++) {
      action = actions[_i];
      try {
        fn = null;
        if (this[action.type] != null) {
          fn = this[action.type];
          _results.push(fn.call(this, action));
        } else {
          fn = eval(action.type);
          _results.push(fn(action));
        }
      } catch (e) {
        _results.push(console.log("Failed preforming action " + action.type));
      }
    }
    return _results;
  };

  WSF_CONTROL.prototype.process_update = function(new_states) {
    var control, _i, _len, _ref;
    try {
      if (new_states.actions != null) {
        this.process_actions(new_states.actions);
      }
      if (new_states[this.control_name] != null) {
        this.update(new_states[this.control_name]);
        _ref = this.controls;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          control = _ref[_i];
          if (control != null) {
            control.process_update(new_states[this.control_name]['controls']);
          }
        }
      }
    } catch (e) {
      return;
    }
  };

  WSF_CONTROL.prototype.get_context_state = function() {
    if ((this.parent_control != null) && !this.isolation) {
      return this.parent_control.get_context_state();
    }
    return this.wrap(this.control_name, this.fullstate);
  };

  WSF_CONTROL.prototype.get_full_control_name = function() {
    var val;
    if (this.parent_control != null) {
      val = this.parent_control.get_full_control_name();
      if (val !== "") {
        val = val + "-";
      }
      return val + this.control_name;
    }
    return this.control_name;
  };

  WSF_CONTROL.prototype.wrap = function(cname, state) {
    var ctrs;
    ctrs = {};
    ctrs[cname] = state;
    state = {
      "controls": ctrs
    };
    if (this.parent_control != null) {
      return this.parent_control.wrap(this.parent_control.control_name, state);
    }
    return state;
  };

  WSF_CONTROL.prototype.callback_url = function(params) {
    if (this.parent_control != null) {
      return this.parent_control.callback_url(params);
    }
    $.extend(params, this.url_params);
    return this.url + '?' + $.param(params);
  };

  WSF_CONTROL.prototype.trigger_callback = function(control_name, event, event_parameter) {
    return this.run_trigger_callback(this.get_full_control_name(), event, event_parameter);
  };

  WSF_CONTROL.prototype.get_page = function() {
    if (this.parent_control != null) {
      return this.parent_control.get_page();
    }
    return this;
  };

  WSF_CONTROL.prototype.run_trigger_callback = function(control_name, event, event_parameter) {
    var self;
    if ((this.parent_control != null) && !this.isolation) {
      return this.parent_control.run_trigger_callback(control_name, event, event_parameter);
    }
    self = this;
    return $.ajax({
      type: 'POST',
      url: this.callback_url({
        control_name: control_name,
        event: event,
        event_parameter: event_parameter
      }),
      data: JSON.stringify(this.get_context_state()),
      processData: false,
      contentType: 'application/json',
      cache: false
    }).done(function(new_states) {
      return self.get_page().process_update(new_states);
    });
  };

  WSF_CONTROL.prototype.on = function(name, callback, context) {
    if (this._events == null) {
      this._events = {};
    }
    if (this._events[name] == null) {
      this._events[name] = [];
    }
    this._events[name].push({
      callback: callback,
      context: context
    });
    return this;
  };

  WSF_CONTROL.prototype.trigger = function(name) {
    var ev, _i, _len, _ref, _ref1;
    if (((_ref = this._events) != null ? _ref[name] : void 0) == null) {
      return this;
    }
    _ref1 = this._events[name];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      ev = _ref1[_i];
      ev.callback.call(ev.context);
    }
    return this;
  };

  WSF_CONTROL.prototype.remove = function() {
    console.log("Removed " + this.control_name);
    return this.$el.remove();
  };

  return WSF_CONTROL;

})();

WSF_PAGE_CONTROL = (function(_super) {

  __extends(WSF_PAGE_CONTROL, _super);

  function WSF_PAGE_CONTROL(fullstate) {
    this.fullstate = fullstate;
    this.state = this.fullstate.state;
    this.parent_control = null;
    this.$el = $('[data-name=' + this.state.id + ']');
    this.control_name = this.state.id;
    this.url = this.state['url'];
    this.url_params = jQuery.unparam(this.state['url_params']);
    this.$el.data('control', this);
    this.initialize = lazy_load(this.requirements, this.attach_events, this);
    this.load_subcontrols();
  }

  WSF_PAGE_CONTROL.prototype.process_update = function(new_states) {
    var control, _i, _len, _ref;
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      if (control != null) {
        control.process_update(new_states);
      }
    }
  };

  WSF_PAGE_CONTROL.prototype.get_full_control_name = function() {
    return "";
  };

  WSF_PAGE_CONTROL.prototype.wrap = function(cname, state) {
    return state;
  };

  WSF_PAGE_CONTROL.prototype.remove = function() {
    console.log("Removed " + this.control_name);
    return this.$el.remove();
  };

  return WSF_PAGE_CONTROL;

})(WSF_CONTROL);

WSF_SLIDER_CONTROL = (function(_super) {

  __extends(WSF_SLIDER_CONTROL, _super);

  function WSF_SLIDER_CONTROL() {
    return WSF_SLIDER_CONTROL.__super__.constructor.apply(this, arguments);
  }

  WSF_SLIDER_CONTROL.prototype.requirements = ['/assets/bootstrap.min.js'];

  WSF_SLIDER_CONTROL.prototype.attach_events = function() {
    var id;
    WSF_SLIDER_CONTROL.__super__.attach_events.apply(this, arguments);
    id = "slider" + Math.round(Math.random() * 10000);
    this.$el.attr("id", id);
    this.$el.find("ol li").attr("data-target", "#" + id);
    return this.$el.find(".carousel-control").attr("href", "#" + id);
  };

  return WSF_SLIDER_CONTROL;

})(WSF_CONTROL);

WSF_DROPDOWN_CONTROL = (function(_super) {

  __extends(WSF_DROPDOWN_CONTROL, _super);

  function WSF_DROPDOWN_CONTROL() {
    return WSF_DROPDOWN_CONTROL.__super__.constructor.apply(this, arguments);
  }

  WSF_DROPDOWN_CONTROL.prototype.requirements = ['/assets/bootstrap.min.js'];

  return WSF_DROPDOWN_CONTROL;

})(WSF_CONTROL);

controls = {};

WSF_BUTTON_CONTROL = (function(_super) {

  __extends(WSF_BUTTON_CONTROL, _super);

  function WSF_BUTTON_CONTROL() {
    return WSF_BUTTON_CONTROL.__super__.constructor.apply(this, arguments);
  }

  WSF_BUTTON_CONTROL.prototype.attach_events = function() {
    var self;
    WSF_BUTTON_CONTROL.__super__.attach_events.apply(this, arguments);
    self = this;
    return this.$el.click(function(e) {
      e.preventDefault();
      return self.click();
    });
  };

  WSF_BUTTON_CONTROL.prototype.click = function() {
    if (this.state['callback_click']) {
      return this.trigger_callback(this.control_name, 'click');
    }
  };

  WSF_BUTTON_CONTROL.prototype.update = function(state) {
    if (state.text != null) {
      this.state['text'] = state.text;
      return this.$el.text(state.text);
    }
  };

  return WSF_BUTTON_CONTROL;

})(WSF_CONTROL);

WSF_INPUT_CONTROL = (function(_super) {

  __extends(WSF_INPUT_CONTROL, _super);

  function WSF_INPUT_CONTROL() {
    return WSF_INPUT_CONTROL.__super__.constructor.apply(this, arguments);
  }

  WSF_INPUT_CONTROL.prototype.attach_events = function() {
    var self;
    WSF_INPUT_CONTROL.__super__.attach_events.apply(this, arguments);
    self = this;
    return this.$el.change(function() {
      return self.change();
    });
  };

  WSF_INPUT_CONTROL.prototype.change = function() {
    this.state['text'] = this.$el.val();
    if (this.state['callback_change']) {
      this.trigger_callback(this.control_name, 'change');
    }
    return this.trigger('change');
  };

  WSF_INPUT_CONTROL.prototype.value = function() {
    return this.$el.val();
  };

  WSF_INPUT_CONTROL.prototype.update = function(state) {
    if (state.text != null) {
      this.state['text'] = state.text;
      return this.$el.val(state.text);
    }
  };

  return WSF_INPUT_CONTROL;

})(WSF_CONTROL);

WSF_FILE_CONTROL = (function(_super) {

  __extends(WSF_FILE_CONTROL, _super);

  function WSF_FILE_CONTROL() {
    WSF_FILE_CONTROL.__super__.constructor.apply(this, arguments);
    this.uploading = false;
  }

  WSF_FILE_CONTROL.prototype.start_upload = function() {
    var action, file, formData;
    if (this.uploading) {
      return;
    }
    this.uploading = true;
    this.$el.hide();
    this.progressbar = $("<div class=\"progress progress-striped active upload\"><div rstyle=\"width: 10%;\" class=\"progress-bar\"></div></div>");
    this.$el.parent().append(this.progressbar);
    formData = new FormData();
    action = this.callback_url({
      control_name: this.get_full_control_name(),
      event: "uploadfile",
      event_parameter: ""
    });
    file = this.$el[0].files[0];
    formData.append('file', file);
    formData.append('state', JSON.stringify(this.get_context_state()));
    return this.sendXHRequest(formData, action);
  };

  WSF_FILE_CONTROL.prototype.sendXHRequest = function(formData, uri) {
    var onprogressHandler, onstatechange, self, xhr;
    xhr = new XMLHttpRequest();
    self = this;
    onprogressHandler = function(evt) {
      var percent;
      percent = evt.loaded / evt.total * 100;
      return self.progressbar.find('.progress-bar').css({
        'width': percent + "%"
      });
    };
    onstatechange = function(evt) {
      if (xhr.readyState === 4 && xhr.status === 200) {
        return self.get_page().process_update(JSON.parse(xhr.responseText));
      }
    };
    xhr.upload.addEventListener('progress', onprogressHandler, false);
    xhr.addEventListener('readystatechange', onstatechange, false);
    xhr.open('POST', uri, true);
    return xhr.send(formData);
  };

  WSF_FILE_CONTROL.prototype.attach_events = function() {
    var self;
    WSF_FILE_CONTROL.__super__.attach_events.apply(this, arguments);
    self = this;
    return this.$el.change(function() {
      return self.change();
    });
  };

  WSF_FILE_CONTROL.prototype.change = function() {
    var file;
    this.state['file'] = null;
    this.state['type'] = null;
    this.state['size'] = null;
    if (this.$el[0].files.length > 0) {
      file = this.$el[0].files[0];
      this.state['file'] = file.name;
      this.state['type'] = file.type;
      this.state['size'] = file.size;
    }
    if (this.state['callback_change']) {
      this.trigger_callback(this.control_name, 'change');
    }
    return this.trigger('change');
  };

  WSF_FILE_CONTROL.prototype.value = function() {
    return this.$el.val();
  };

  WSF_FILE_CONTROL.prototype.update = function(state) {
    if (state.upload_file != null) {
      this.progressbar.hide();
      this.$el.parent().append($("<p></p>").addClass("form-control-static").text(this.state['file']));
      return this.state['upload_file'] = state.upload_file;
    }
  };

  return WSF_FILE_CONTROL;

})(WSF_CONTROL);

WSF_PASSWORD_CONTROL = (function(_super) {

  __extends(WSF_PASSWORD_CONTROL, _super);

  function WSF_PASSWORD_CONTROL() {
    return WSF_PASSWORD_CONTROL.__super__.constructor.apply(this, arguments);
  }

  return WSF_PASSWORD_CONTROL;

})(WSF_INPUT_CONTROL);

WSF_NAVLIST_ITEM_CONTROL = (function(_super) {

  __extends(WSF_NAVLIST_ITEM_CONTROL, _super);

  function WSF_NAVLIST_ITEM_CONTROL() {
    return WSF_NAVLIST_ITEM_CONTROL.__super__.constructor.apply(this, arguments);
  }

  WSF_NAVLIST_ITEM_CONTROL.prototype.update = function(state) {
    WSF_NAVLIST_ITEM_CONTROL.__super__.update.apply(this, arguments);
    if (state.active != null) {
      this.state['active'] = state.active;
      if (state.active) {
        return this.$el.addClass("active");
      } else {
        return this.$el.removeClass("active");
      }
    }
  };

  return WSF_NAVLIST_ITEM_CONTROL;

})(WSF_BUTTON_CONTROL);

WSF_TEXTAREA_CONTROL = (function(_super) {

  __extends(WSF_TEXTAREA_CONTROL, _super);

  function WSF_TEXTAREA_CONTROL() {
    return WSF_TEXTAREA_CONTROL.__super__.constructor.apply(this, arguments);
  }

  return WSF_TEXTAREA_CONTROL;

})(WSF_INPUT_CONTROL);

WSF_CODEVIEW_CONTROL = (function(_super) {

  __extends(WSF_CODEVIEW_CONTROL, _super);

  function WSF_CODEVIEW_CONTROL() {
    WSF_CODEVIEW_CONTROL.__super__.constructor.apply(this, arguments);
    this.initialize = lazy_load(['/assets/codemirror/codemirror.js', '/assets/codemirror/codemirror.css', '/assets/codemirror/estudio.css'], lazy_load(['/assets/codemirror/eiffel.js'], this.attach_events, this), this);
  }

  WSF_CODEVIEW_CONTROL.prototype.attach_events = function() {
    WSF_CODEVIEW_CONTROL.__super__.attach_events.apply(this, arguments);
    this.editor = CodeMirror.fromTextArea(this.$el[0], {
      mode: "eiffel",
      tabMode: "indent",
      indentUnit: 4,
      lineNumbers: true,
      theme: 'estudio'
    });
    return this.editor.setSize("100%", 700);
  };

  WSF_CODEVIEW_CONTROL.prototype.remove = function() {
    this.editor.toTextArea();
    return WSF_CODEVIEW_CONTROL.__super__.remove.apply(this, arguments);
  };

  return WSF_CODEVIEW_CONTROL;

})(WSF_INPUT_CONTROL);

WSF_AUTOCOMPLETE_CONTROL = (function(_super) {

  __extends(WSF_AUTOCOMPLETE_CONTROL, _super);

  function WSF_AUTOCOMPLETE_CONTROL() {
    return WSF_AUTOCOMPLETE_CONTROL.__super__.constructor.apply(this, arguments);
  }

  WSF_AUTOCOMPLETE_CONTROL.prototype.requirements = ['assets/typeahead.min.js'];

  WSF_AUTOCOMPLETE_CONTROL.prototype.attach_events = function() {
    var self;
    WSF_AUTOCOMPLETE_CONTROL.__super__.attach_events.apply(this, arguments);
    self = this;
    console.log(this.$el);
    this.$el.typeahead({
      name: this.control_name + Math.random(),
      template: this.state['template'],
      engine: Mini,
      remote: {
        url: "",
        replace: function(url, uriEncodedQuery) {
          self.state['text'] = self.$el.val();
          return '?' + $.param({
            control_name: self.control_name,
            event: 'autocomplete',
            states: JSON.stringify(self.get_context_state())
          });
        },
        filter: function(parsedResponse) {
          return parseSuggestions(parsedResponse);
        },
        fn: function() {
          return self.trigger_callback(self.control_name, 'autocomplete');
        }
      }
    });
    this.$el.on('typeahead:closed', function() {
      return self.change();
    });
    return this.$el.on('typeahead:blured', function() {
      return self.change();
    });
  };

  return WSF_AUTOCOMPLETE_CONTROL;

})(WSF_INPUT_CONTROL);

WSF_CHECKBOX_CONTROL = (function(_super) {

  __extends(WSF_CHECKBOX_CONTROL, _super);

  function WSF_CHECKBOX_CONTROL() {
    return WSF_CHECKBOX_CONTROL.__super__.constructor.apply(this, arguments);
  }

  WSF_CHECKBOX_CONTROL.prototype.attach_events = function() {
    var self;
    WSF_CHECKBOX_CONTROL.__super__.attach_events.apply(this, arguments);
    self = this;
    this.checked_value = this.state['checked_value'];
    return this.$el.change(function() {
      return self.change();
    });
  };

  WSF_CHECKBOX_CONTROL.prototype.change = function() {
    this.state['checked'] = this.$el.is(':checked');
    if (this.state['callback_change']) {
      this.trigger_callback(this.control_name, 'change');
    }
    return this.trigger('change');
  };

  WSF_CHECKBOX_CONTROL.prototype.value = function() {
    return this.$el.is(':checked');
  };

  WSF_CHECKBOX_CONTROL.prototype.update = function(state) {
    if (state.text != null) {
      this.state['checked'] = state.checked;
      return this.$el.prop('checked', state.checked);
    }
  };

  return WSF_CHECKBOX_CONTROL;

})(WSF_CONTROL);

WSF_FORM_ELEMENT_CONTROL = (function(_super) {

  __extends(WSF_FORM_ELEMENT_CONTROL, _super);

  function WSF_FORM_ELEMENT_CONTROL() {
    return WSF_FORM_ELEMENT_CONTROL.__super__.constructor.apply(this, arguments);
  }

  WSF_FORM_ELEMENT_CONTROL.prototype.attach_events = function() {
    var self, validator, validatorclass, _i, _len, _ref;
    WSF_FORM_ELEMENT_CONTROL.__super__.attach_events.apply(this, arguments);
    self = this;
    this.value_control = this.controls[0];
    if (this.value_control != null) {
      this.value_control.on('change', this.change, this);
    }
    this.serverside_validator = false;
    this.validators = [];
    _ref = this.state['validators'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      validator = _ref[_i];
      try {
        validatorclass = eval(validator.name);
        this.validators.push(new validatorclass(this, validator));
      } catch (e) {
        this.serverside_validator = true;
      }
    }
  };

  WSF_FORM_ELEMENT_CONTROL.prototype.change = function() {
    var validator, _i, _len, _ref;
    _ref = this.validators;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      validator = _ref[_i];
      if (!validator.validate()) {
        this.showerror(validator.error);
        return;
      }
    }
    this.showerror("");
    if (this.serverside_validator) {
      this.trigger_callback(this.control_name, 'validate');
    }
  };

  WSF_FORM_ELEMENT_CONTROL.prototype.showerror = function(message) {
    var errordiv;
    this.$el.removeClass("has-error");
    this.$el.find(".validation").remove();
    if (message.length > 0) {
      this.$el.addClass("has-error");
      errordiv = $("<div />").addClass('help-block').addClass('validation').text(message);
      return this.$el.children("div").append(errordiv);
    }
  };

  WSF_FORM_ELEMENT_CONTROL.prototype.update = function(state) {
    if (state.error != null) {
      return this.showerror(state.error);
    }
  };

  WSF_FORM_ELEMENT_CONTROL.prototype.value = function() {
    return this.value_control.value();
  };

  return WSF_FORM_ELEMENT_CONTROL;

})(WSF_CONTROL);

WSF_HTML_CONTROL = (function(_super) {

  __extends(WSF_HTML_CONTROL, _super);

  function WSF_HTML_CONTROL() {
    return WSF_HTML_CONTROL.__super__.constructor.apply(this, arguments);
  }

  WSF_HTML_CONTROL.prototype.value = function() {
    return this.$el.html();
  };

  WSF_HTML_CONTROL.prototype.update = function(state) {
    if (state.html != null) {
      this.state['html'] = state.html;
      return this.$el.html(state.html);
    }
  };

  return WSF_HTML_CONTROL;

})(WSF_CONTROL);

WSF_CHECKBOX_LIST_CONTROL = (function(_super) {

  __extends(WSF_CHECKBOX_LIST_CONTROL, _super);

  function WSF_CHECKBOX_LIST_CONTROL() {
    return WSF_CHECKBOX_LIST_CONTROL.__super__.constructor.apply(this, arguments);
  }

  WSF_CHECKBOX_LIST_CONTROL.prototype.attach_events = function() {
    var control, _i, _len, _ref;
    WSF_CHECKBOX_LIST_CONTROL.__super__.attach_events.apply(this, arguments);
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      control.on('change', this.change, this);
    }
  };

  WSF_CHECKBOX_LIST_CONTROL.prototype.change = function() {
    return this.trigger("change");
  };

  WSF_CHECKBOX_LIST_CONTROL.prototype.value = function() {
    var result, subc, _i, _len, _ref;
    result = [];
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      subc = _ref[_i];
      if (subc.value()) {
        result.push(subc.checked_value);
      }
    }
    return result;
  };

  return WSF_CHECKBOX_LIST_CONTROL;

})(WSF_CONTROL);

WSF_PROGRESS_CONTROL = (function(_super) {

  __extends(WSF_PROGRESS_CONTROL, _super);

  function WSF_PROGRESS_CONTROL() {
    return WSF_PROGRESS_CONTROL.__super__.constructor.apply(this, arguments);
  }

  WSF_PROGRESS_CONTROL.prototype.attach_events = function() {
    var runfetch, self;
    WSF_PROGRESS_CONTROL.__super__.attach_events.apply(this, arguments);
    self = this;
    runfetch = function() {
      return self.fetch();
    };
    return this.int = setInterval(runfetch, 5000);
  };

  WSF_PROGRESS_CONTROL.prototype.fetch = function() {
    return this.trigger_callback(this.control_name, 'progress_fetch');
  };

  WSF_PROGRESS_CONTROL.prototype.update = function(state) {
    if (state.progress != null) {
      this.state['progress'] = state.progress;
      return this.$el.children('.progress-bar').attr('aria-valuenow', state.progress).width(state.progress + '%');
    }
  };

  WSF_PROGRESS_CONTROL.prototype.remove = function() {
    clearInterval(this.int);
    return WSF_PROGRESS_CONTROL.__super__.remove.apply(this, arguments);
  };

  return WSF_PROGRESS_CONTROL;

})(WSF_CONTROL);

WSF_PAGINATION_CONTROL = (function(_super) {

  __extends(WSF_PAGINATION_CONTROL, _super);

  function WSF_PAGINATION_CONTROL() {
    return WSF_PAGINATION_CONTROL.__super__.constructor.apply(this, arguments);
  }

  WSF_PAGINATION_CONTROL.prototype.attach_events = function() {
    var self;
    self = this;
    return this.$el.on('click', 'a', function(e) {
      e.preventDefault();
      return self.click(e);
    });
  };

  WSF_PAGINATION_CONTROL.prototype.click = function(e) {
    var nr;
    nr = $(e.target).data('nr');
    if (nr === "next") {
      return this.trigger_callback(this.control_name, "next");
    } else if (nr === "prev") {
      return this.trigger_callback(this.control_name, "prev");
    } else {
      return this.trigger_callback(this.control_name, "goto", nr);
    }
  };

  WSF_PAGINATION_CONTROL.prototype.update = function(state) {
    if (state._html != null) {
      return this.$el.html($(state._html).html());
    }
  };

  return WSF_PAGINATION_CONTROL;

})(WSF_CONTROL);

WSF_GRID_CONTROL = (function(_super) {

  __extends(WSF_GRID_CONTROL, _super);

  function WSF_GRID_CONTROL() {
    return WSF_GRID_CONTROL.__super__.constructor.apply(this, arguments);
  }

  WSF_GRID_CONTROL.prototype.attach_events = function() {
    var self;
    WSF_GRID_CONTROL.__super__.attach_events.apply(this, arguments);
    return self = this;
  };

  WSF_GRID_CONTROL.prototype.update = function(state) {
    if (state.datasource != null) {
      this.state['datasource'] = state.datasource;
    }
    if (state._body != null) {
      return this.$el.find('tbody').html(state._body);
    }
  };

  return WSF_GRID_CONTROL;

})(WSF_CONTROL);

WSF_REPEATER_CONTROL = (function(_super) {

  __extends(WSF_REPEATER_CONTROL, _super);

  function WSF_REPEATER_CONTROL() {
    return WSF_REPEATER_CONTROL.__super__.constructor.apply(this, arguments);
  }

  WSF_REPEATER_CONTROL.prototype.attach_events = function() {
    var self;
    WSF_REPEATER_CONTROL.__super__.attach_events.apply(this, arguments);
    return self = this;
  };

  WSF_REPEATER_CONTROL.prototype.update = function(state) {
    if (state.datasource != null) {
      this.state['datasource'] = state.datasource;
    }
    if (state._body != null) {
      this.$el.find('.repeater_content').html(state._body);
      return console.log(state._body);
    }
  };

  return WSF_REPEATER_CONTROL;

})(WSF_CONTROL);

redirect = function(action) {
  return document.location.href = action.url;
};

show_alert = function(action) {
  return alert(action.message);
};

start_modal = lazy_load(['/assets/bootstrap.min.js'], function(action) {
  var cssclass, modal;
  cssclass = "";
  if (action.type === "start_modal_big") {
    cssclass = " big";
  }
  modal = $("<div class=\"modal fade\">\n<div class=\"modal-dialog" + cssclass + "\">\n  <div class=\"modal-content\">\n    <div class=\"modal-header\">\n      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n      <h4 class=\"modal-title\">" + action.title + "</h4>\n    </div>\n    <div class=\"modal-body\">\n    \n    </div>\n  </div>\n</div>\n</div>");
  modal.appendTo('body');
  modal.modal('show');
  modal.on('hidden.bs.modal', function() {
    $(modal.find('[data-name]').get().reverse()).each(function(i, value) {
      $(value).data('control').remove();
    });
  });
  return $.get(action.url, {
    ajax: 1
  }).done(function(data) {
    return modal.find('.modal-body').append(data);
  });
});

start_modal_big = start_modal;
