<?php

Class Arr {
	public static function array_rmerge() {
		// Get array arguments
		$arrays = func_get_args();

		// Define the original array
		$original = array_shift($arrays);

		// Loop through arrays
		foreach ($arrays as $array) {
			// Loop through array key/value pairs
			if( is_array($array) ) {
				foreach ($array as $key => $value) {
					// Value is an array
					if( is_array($value) ){
						// Traverse the array; replace or add result to original array
						$original[$key] = self::array_rmerge($original[$key], $array[$key]);
					}
					// Value is not an array
					else {
						// Replace or add current value to original array
						$original[$key] = $value;
					}
				}
			}
		}

		// Return the joined array
		return $original;
	}
}
?>