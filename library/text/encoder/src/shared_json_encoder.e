note
	description: "Objects to access the shared once JSON_ENCODER ..."
	date: "$Date$"
	revision: "$Revision$"

class
	SHARED_JSON_ENCODER

feature -- Encoder

	json_encoder: JSON_ENCODER
			-- Shared JSON encoder.
		once
			create Result
		end

note
	copyright: "2011-2012, Eiffel Software and others"
	license: "Eiffel Forum License v2 (see http://www.eiffel.com/licensing/forum.txt)"
	source: "[
			Eiffel Software
			5949 Hollister Ave., Goleta, CA 93117 USA
			Telephone 805-685-1006, Fax 805-685-6869
			Website http://www.eiffel.com
			Customer support http://support.eiffel.com
		]"

end
