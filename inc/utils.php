<?php
  /**
  * Return false if to fetch the new counts.
  *
  * @return bool
  * @since 1.0.0
  */
  function sharing_plus_is_cache_fresh( $post_id, $output = false, $ajax = false ) {
    // global $swp_user_options;
    // Bail early if it's a crawl bot. If so, ONLY SERVE CACHED RESULTS FOR MAXIMUM SPEED.
    if ( isset( $_SERVER['HTTP_USER_AGENT'] ) && preg_match( '/bot|crawl|slurp|spider/i',  wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) ) {
      return true;
    }

    // $options = $swp_user_options;
    $fresh_cache = false;

    if( isset( $_POST['sharing_plus_cache'] ) && 'rebuild' === $_POST['sharing_plus_cache'] ) {
      return false;
    }
    // Always be TRUE if we're not on a single.php otherwise we could end up
    // Rebuilding multiple page caches which will cost a lot of time.
    // if ( ! is_singular() && ! $ajax ) {
    //   return true;
    // }

    $post_age = floor( date( 'U' ) - get_post_time( 'U' , false , $post_id ) );

    if ( $post_age < ( 21 * 86400 ) ) {
      $hours = 1;
    } elseif ( $post_age < ( 60 * 86400 ) ) {
      $hours = 4;
    } else {
      $hours = 12;
    }

    $time = floor( ( ( date( 'U' ) / 60 ) / 60 ) );
    $last_checked = get_post_meta( $post_id, 'sharing_plus_cache_timestamp', true );

    if ( $last_checked > ( $time - $hours ) && $last_checked > 390000 ) {
      $fresh_cache = true;
    } else {
      $fresh_cache = false;
    }

    return $fresh_cache;
  }


	/**
	 * Fetch counts + http or https resolve .
	 *
	 * @param  Array  $stats
	 * @param  String $post_id
	 * @return Array Simple array with counts.
	 * @since 1.0.0
	 */
	function  sharing_plus_fetch_http_or_https_counts( $stats, $post_id ){
		$stats_result = array();
		$networks = array();
		foreach ( $stats as $social_name => $counts ) {
      if ( 'totalshare' == $social_name || 'viber' == $social_name || 'fblike' == $social_name || 'whatsapp' == $social_name || 'print' == $social_name || 'email' == $social_name || 'messenger' == $social_name )
       { continue; }
     $stats_counts  = call_user_func( 'sharing_plus_format_' . $social_name . '_response', $counts );
     $networks[ $social_name] = $stats_counts;
   }
		// special case if post id not exist for example short code run on widget out side the loop in archive page
   if( 0 !== $post_id ){
     update_post_meta( $post_id, 'sharing_plus_old_counts', $networks );
   }else{
     update_option( 'sharing_plus_not_exist_post_old_counts', $networks );
   }

 }

  /**
  * Get the cahced counts.
  *
  * @param  Array  $network_name
  * @param  String $post_id
  * @return Array Counts of each network.
  * @since 1.0.0
  */
  function sharing_plus_fetch_cached_counts( $network_name, $post_id ) {
    $network_name[] = 'total';
    $result = array();
    foreach ( $network_name as $social_name ) {
	    // special case if post id not exist for example short code run on widget out side the loop in archive page
     if( 0 !== $post_id ){
      $result[ $social_name ] = get_post_meta( $post_id, 'sharing_plus_' . $social_name . '_counts', true );
    }else{
      $result[ $social_name ] = get_option( 'sharing_plus_not_exist_post_'. $social_name .'_counts'  );
    }
  }
  return $result;
}
