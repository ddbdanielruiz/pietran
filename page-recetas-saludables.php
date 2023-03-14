<?php
/**
 * Template Name: Template Page Recetas saludables
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

$preparation_terms = [31];
$context['recipes'] = new PostQuery(array(
    'post_type' => 'receta',
    'order' => 'asc',
    'orderby' => 'date',
    'post_status' => array('publish'),
    //'posts_per_page' => 1,
	'tax_query' => array( 
        array(
        'taxonomy' => 'tipos_de_preparacion',
        'field' => 'term_id', 
        'terms' => $preparation_terms,
        'operator' => 'IN'
        )
    ),
));


//terms
$context['moments'] = Timber::get_terms([
    'taxonomy' => 'momentos',
]);

$context['preparations'] = Timber::get_terms([
    'taxonomy' => 'tipos_de_preparacion',
]);

$context['preparation_terms'] = $preparation_terms;

//Related products
$related_product_args = [
    'post_type' => 'producto', 
    'post_status'     => 'publish',
    'posts_per_page' =>3,
    'orderby' => 'rand'
];

$context['related_products'] = new \Timber\PostQuery($related_product_args);

Timber::render(['page-recetas.twig'], $context);