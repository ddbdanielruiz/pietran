<?php 
function cptui_register_my_cpts() {

	/**
	 * Post Type: Productos.
	 */

	$labels = [
		"name" => __( "Productos", "custom-post-type-ui" ),
		"singular_name" => __( "Producto", "custom-post-type-ui" ),
	];

	$args = [
		"label" => __( "Productos", "custom-post-type-ui" ),
		"labels" => $labels,
		"description" => "",
		"public" => true,
		"publicly_queryable" => true,
		"show_ui" => true,
		"show_in_rest" => true,
		"rest_base" => "",
		"rest_controller_class" => "WP_REST_Posts_Controller",
		"has_archive" => false,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"delete_with_user" => false,
		"exclude_from_search" => false,
		"capability_type" => "post",
		"map_meta_cap" => true,
		"hierarchical" => false,
		"rewrite" => [ "slug" => "producto", "with_front" => true ],
		"query_var" => true,
		"menu_icon" => "dashicons-products",
		"supports" => [ "title", "editor", "thumbnail", "excerpt", "revisions" ],
		"taxonomies" => [ "categorias_de_producto" ],
		"show_in_graphql" => false,
	];

	register_post_type( "producto", $args );

	/**
	 * Post Type: Recetas.
	 */

	$labels = [
		"name" => __( "Recetas", "custom-post-type-ui" ),
		"singular_name" => __( "Receta", "custom-post-type-ui" ),
	];

	$args = [
		"label" => __( "Recetas", "custom-post-type-ui" ),
		"labels" => $labels,
		"description" => "",
		"public" => true,
		"publicly_queryable" => true,
		"show_ui" => true,
		"show_in_rest" => true,
		"rest_base" => "",
		"rest_controller_class" => "WP_REST_Posts_Controller",
		"has_archive" => false,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"delete_with_user" => false,
		"exclude_from_search" => false,
		"capability_type" => "post",
		"map_meta_cap" => true,
		"hierarchical" => false,
		"rewrite" => [ "slug" => "/", "with_front" => false ],
		"query_var" => "/",
		"menu_icon" => "dashicons-food",
		"supports" => [ "title", "editor", "thumbnail" ],
		"taxonomies" => [ "categorias_de_producto" ],
		"show_in_graphql" => false,
	];

	register_post_type( "receta", $args );

	/**
	 * Post Type: Puntos de Venta.
	 */

	$labels = [
		"name" => __( "Puntos de Venta", "custom-post-type-ui" ),
		"singular_name" => __( "Punto de Venta", "custom-post-type-ui" ),
	];

	$args = [
		"label" => __( "Puntos de Venta", "custom-post-type-ui" ),
		"labels" => $labels,
		"description" => "",
		"public" => true,
		"publicly_queryable" => true,
		"show_ui" => true,
		"show_in_rest" => true,
		"rest_base" => "",
		"rest_controller_class" => "WP_REST_Posts_Controller",
		"has_archive" => false,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"delete_with_user" => false,
		"exclude_from_search" => false,
		"capability_type" => "post",
		"map_meta_cap" => true,
		"hierarchical" => false,
		"rewrite" => [ "slug" => "punto_de_venta", "with_front" => true ],
		"query_var" => true,
		"menu_icon" => "dashicons-store",
		"supports" => [ "title", "editor", "thumbnail" ],
		"show_in_graphql" => false,
	];

	register_post_type( "punto_de_venta", $args );
}

add_action( 'init', 'cptui_register_my_cpts' );
