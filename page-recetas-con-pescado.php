<?php
/**
 * Template Name: Template Page Recetas con Pescado
 */

use \Timber\Post;
use Timber\Timber;
use Timber\PostQuery;

$context            = Timber::get_context();
$post               = new Post();
$context['post']    = $post;

$context['products'] = Timber::get_posts(array(
    'post_type' => 'producto',
    'posts_per_page' => -1,
    'post_status' => array('publish'),
));

$product_category_term = [5];
$context['recipes'] = new PostQuery(array(
    'post_type' => 'receta',
    'order' => 'asc',
    'orderby' => 'date',
    'post_status' => array('publish'),
	'tax_query' => array( 
        array(
            'taxonomy' => 'categorias_de_producto',
            'field' => 'term_id', 
            'terms' => $product_category_term,
            'operator' => 'IN'
        )
    ),
));

//terms
$context['moments'] = Timber::get_terms([
    'taxonomy' => 'momentos',
    //'hide_empty' => true,
]);

$context['preparations'] = Timber::get_terms([
    'taxonomy' => 'tipos_de_preparacion',
    //'hide_empty' => true,
]);

$context['product_category_term'] = $product_category_term;

//Related products
$related_product_args = [
    'post_type' => 'productos', 
    'post_status'     => 'publish',
    'posts_per_page' =>3,
    'orderby' => 'rand'
];

$context['related_products'] = new \Timber\PostQuery($related_product_args);

Timber::render(['page-recetas.twig'], $context);