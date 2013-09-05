// Generated by CoffeeScript 1.6.1
(function() {
  var $el, WSF_BUTTON_CONTROL, WSF_CONTROL, WSF_TEXTAREA_CONTROL, WSF_TEXT_CONTROL, controls, name, state, trigger_callback, type, typemap, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  trigger_callback = function(control_name, event) {
    return $.ajax({
      data: {
        control_name: control_name,
        event: event,
        states: JSON.stringify(states)
      },
      cache: false
    }).done(function(new_states) {
      var name, state, _ref;
      for (name in new_states) {
        state = new_states[name];
        if ((_ref = controls[name]) != null) {
          _ref.update(state);
        }
      }
    });
  };

  WSF_CONTROL = (function() {

    function WSF_CONTROL(control_name, $el) {
      this.control_name = control_name;
      this.$el = $el;
      this.attach_events();
      return;
    }

    WSF_CONTROL.prototype.attach_events = function() {};

    WSF_CONTROL.prototype.update = function(state) {};

    return WSF_CONTROL;

  })();

  controls = {};

  WSF_BUTTON_CONTROL = (function(_super) {

    __extends(WSF_BUTTON_CONTROL, _super);

    function WSF_BUTTON_CONTROL() {
      return WSF_BUTTON_CONTROL.__super__.constructor.apply(this, arguments);
    }

    WSF_BUTTON_CONTROL.prototype.attach_events = function() {
      var self;
      self = this;
      return this.$el.click(function(e) {
        e.preventDefault();
        return self.click();
      });
    };

    WSF_BUTTON_CONTROL.prototype.click = function() {
      if (window.states[this.control_name]['callback_click']) {
        return trigger_callback(this.control_name, 'click');
      }
    };

    WSF_BUTTON_CONTROL.prototype.update = function(state) {
      if (state.text != null) {
        window.states[this.control_name]['text'] = state.text;
        return this.$el.text(state.text);
      }
    };

    return WSF_BUTTON_CONTROL;

  })(WSF_CONTROL);

  WSF_TEXT_CONTROL = (function(_super) {

    __extends(WSF_TEXT_CONTROL, _super);

    function WSF_TEXT_CONTROL() {
      return WSF_TEXT_CONTROL.__super__.constructor.apply(this, arguments);
    }

    WSF_TEXT_CONTROL.prototype.attach_events = function() {
      var self;
      self = this;
      return this.$el.change(function() {
        return self.change();
      });
    };

    WSF_TEXT_CONTROL.prototype.change = function() {
      window.states[this.control_name]['text'] = this.$el.val();
      if (window.states[this.control_name]['callback_change']) {
        return trigger_callback(this.control_name, 'change');
      }
    };

    WSF_TEXT_CONTROL.prototype.update = function(state) {
      if (state.text != null) {
        window.states[this.control_name]['text'] = state.text;
        return this.$el.val(state.text);
      }
    };

    return WSF_TEXT_CONTROL;

  })(WSF_CONTROL);

  WSF_TEXTAREA_CONTROL = (function(_super) {

    __extends(WSF_TEXTAREA_CONTROL, _super);

    function WSF_TEXTAREA_CONTROL() {
      return WSF_TEXTAREA_CONTROL.__super__.constructor.apply(this, arguments);
    }

    WSF_TEXTAREA_CONTROL.prototype.attach_events = function() {
      var self;
      self = this;
      return this.$el.change(function() {
        return self.change();
      });
    };

    WSF_TEXTAREA_CONTROL.prototype.change = function() {
      window.states[this.control_name]['text'] = this.$el.val();
      if (window.states[this.control_name]['callback_change']) {
        return trigger_callback(this.control_name, 'change');
      }
    };

    WSF_TEXTAREA_CONTROL.prototype.update = function(state) {
      if (state.text != null) {
        window.states[this.control_name]['text'] = state.text;
        return this.$el.val(state.text);
      }
    };

    return WSF_TEXTAREA_CONTROL;

  })(WSF_CONTROL);

  typemap = {
    "WSF_BUTTON_CONTROL": WSF_BUTTON_CONTROL,
    "WSF_TEXT_CONTROL": WSF_TEXT_CONTROL,
    "WSF_TEXTAREA_CONTROL": WSF_TEXTAREA_CONTROL
  };

  _ref = window.states;
  for (name in _ref) {
    state = _ref[name];
    $el = $('[data-name=' + name + ']');
    type = $el.data('type');
    if ((type != null) && (typemap[type] != null)) {
      controls[name] = new typemap[type](name, $el);
    }
  }

}).call(this);
