note
	description: "[
		The basic <input> HTML element is represented by this control.
		All controls that are used to gather some input from the user
		basically can inherit from this class.
	]"
	author: ""
	date: "$Date$"
	revision: "$Revision$"

class
	WSF_INPUT_CONTROL

inherit

	WSF_VALUE_CONTROL [STRING_32]
		rename
			make as make_value_control
		end

create
	make

feature {NONE} -- Initialization

	make (v: STRING_32)
			-- Initialize with specified value
		do
			make_value_control ("input")
			type := "text"
			text := v
		ensure
			text_set: text = v
		end

feature {WSF_PAGE_CONTROL, WSF_CONTROL} -- State management

	set_state (new_state: JSON_OBJECT)
			-- Restore text from json
		do
			if attached {JSON_STRING} new_state.item ("text") as new_text then
				text := new_text.unescaped_string_32
			end
		end

	state: WSF_JSON_OBJECT
			-- Return state which contains the current text and if there is an event handle attached
		do
			create Result.make
			Result.put_string (text, "text")
			Result.put_boolean (disabled, "disabled")
			Result.put_boolean (attached change_event, "callback_change")
		end

feature --Event handling

	set_change_event (e: attached like change_event)
			-- Set text change event handle
		do
			change_event := e
		ensure
			change_event_set: change_event = e
		end

	handle_callback (cname: LIST [STRING_32]; event: STRING_32; event_parameter: detachable ANY)
		do
			if Current.control_name.same_string (cname [1]) and attached change_event as cevent then
				if event.same_string ("change") then
					cevent.call (Void)
				end
			end
		end

feature -- Rendering

	render: STRING_32
		local
			attr: STRING_32
		do
			attr := "type=%"" + type + "%" value=%"" + text + "%" "
			if attached attributes as a then
				attr.append (a)
			end
			if disabled then
				attr.append ("disabled=%"disabled%" ")
			end
			Result := render_tag ("", attr)
		end

feature -- Change

	set_text (t: STRING_32)
			-- Set text to be displayed
		do
			if not t.same_string (text) then
				text := t
				state_changes.replace (create {JSON_STRING}.make_json (text), "text")
			end
		ensure
			text_same_string_as_t: text.same_string (t)
			state_changes_registered: old text /= text implies state_changes.has_key ("text")
		end

	set_disabled (b: BOOLEAN)
			-- Set the disabled state of this control
		do
			if disabled /= b then
				disabled := b
				state_changes.replace_with_boolean (disabled, "disabled")
			end
		ensure
			disabled_set: disabled = b
			state_changes_registered: old b /= b implies state_changes.has_key ("disabled")
		end

	set_type (t: STRING_32)
			-- Set the type of this input control (HTML 'type' attribute)
		do
			type := t
		ensure
			type_set: type = t
		end

feature -- Implementation

	value: STRING_32
			-- The value of this input control
		do
			Result := text
		end

	set_value (v: STRING_32)
			-- Set the value of this input control
		do
			text := v
		ensure then
			value_set: text = v
		end

feature -- Properties

	disabled: BOOLEAN
			-- Defines if the input field is editable

	text: STRING_32
			-- Text to be displayed

	type: STRING_32
			-- Type of this input control

	change_event: detachable PROCEDURE [ANY, TUPLE]
			-- Procedure to be execued on change

end
