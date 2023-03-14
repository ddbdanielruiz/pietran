<?php function cptui_register_my_taxes() {

	/**
	 * Taxonomy: Categorías de Producto.
	 */

	$labels = [
		"name" => __( "Categorías de Producto", "custom-post-type-ui" ),
		"singular_name" => __( "Categoría de Producto", "custom-post-type-ui" ),
	];

	
	$args = [
		"label" => __( "Categorías de Producto", "custom-post-type-ui" ),
		"labels" => $labels,
		"public" => true,
		"publicly_queryable" => true,
		"hierarchical" => true,
		"show_ui" => true,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"query_var" => true,
		"rewrite" => [ 'slug' => 'categorias_de_producto', 'with_front' => true,  'hierarchical' => true, ],
		"show_admin_column" => true,
		"show_in_rest" => true,
		"show_tagcloud" => false,
		"rest_base" => "categorias_de_producto",
		"rest_controller_class" => "WP_REST_Terms_Controller",
		"show_in_quick_edit" => false,
		"show_in_graphql" => false,
	];
	register_taxonomy( "categorias_de_producto", [ "producto" ], $args );

	/**
	 * Taxonomy: Ciudades.
	 */

	$labels = [
		"name" => __( "Ciudades", "custom-post-type-ui" ),
		"singular_name" => __( "Ciudad", "custom-post-type-ui" ),
	];

	
	$args = [
		"label" => __( "Ciudades", "custom-post-type-ui" ),
		"labels" => $labels,
		"public" => true,
		"publicly_queryable" => true,
		"hierarchical" => true,
		"show_ui" => true,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"query_var" => true,
		"rewrite" => [ 'slug' => 'ciudades', 'with_front' => true, ],
		"show_admin_column" => true,
		"show_in_rest" => true,
		"show_tagcloud" => false,
		"rest_base" => "ciudades",
		"rest_controller_class" => "WP_REST_Terms_Controller",
		"show_in_quick_edit" => false,
		"show_in_graphql" => false,
	];
	register_taxonomy( "ciudades", [ "punto_de_venta" ], $args );

	/**
	 * Taxonomy: Momentos.
	 */

	$labels = [
		"name" => __( "Momentos", "custom-post-type-ui" ),
		"singular_name" => __( "Momento", "custom-post-type-ui" ),
	];

	
	$args = [
		"label" => __( "Momentos", "custom-post-type-ui" ),
		"labels" => $labels,
		"public" => true,
		"publicly_queryable" => true,
		"hierarchical" => true,
		"show_ui" => true,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"query_var" => true,
		"rewrite" => [ 'slug' => 'momentos', 'with_front' => true, ],
		"show_admin_column" => true,
		"show_in_rest" => true,
		"show_tagcloud" => false,
		"rest_base" => "momentos",
		"rest_controller_class" => "WP_REST_Terms_Controller",
		"show_in_quick_edit" => false,
		"show_in_graphql" => false,
	];
	register_taxonomy( "momentos", [ "receta" ], $args );

	/**
	 * Taxonomy: Tipos de Preparación.
	 */

	$labels = [
		"name" => __( "Tipos de Preparación", "custom-post-type-ui" ),
		"singular_name" => __( "Tipo de Preparación", "custom-post-type-ui" ),
	];

	
	$args = [
		"label" => __( "Tipos de Preparación", "custom-post-type-ui" ),
		"labels" => $labels,
		"public" => true,
		"publicly_queryable" => true,
		"hierarchical" => true,
		"show_ui" => true,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"query_var" => true,
		"rewrite" => [ 'slug' => 'tipos_de_preparacion', 'with_front' => true, ],
		"show_admin_column" => true,
		"show_in_rest" => true,
		"show_tagcloud" => false,
		"rest_base" => "tipos_de_preparacion",
		"rest_controller_class" => "WP_REST_Terms_Controller",
		"show_in_quick_edit" => false,
		"show_in_graphql" => false,
	];
	register_taxonomy( "tipos_de_preparacion", [ "receta" ], $args );
}
add_action( 'init', 'cptui_register_my_taxes' );
