<?php
/**
 * The Template for displaying all single posts
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */

use Timber\Timber;

$context = Timber::get_context();
$post = Timber::query_post();
$context['post'] = $post;

//Related Recipes
$related_terms = $post->get_terms('categorias_de_producto');
$related_recipe_args = array(
    'post_status'     => 'publish',
    'post_type' => 'receta', 
    'posts_per_page' => 3,
    'order' => 'rand',
    'post__not_in' => array($post->id)
);

$related_terms = $post->get_terms();
$related_recipe_args['tax_query'] = ['relation' => 'OR'];
 
foreach ($related_terms as $term) {
    $related_recipe_args['tax_query'][] = array(
        'taxonomy' => 'categorias_de_producto',
        'field' => 'id',
        'terms' => array($term->id),
        'operator'  => 'IN',
    );
}

$context['related_recipes'] = new \Timber\PostQuery($related_recipe_args);

if (post_password_required($post->ID)) {
    Timber::render('single-password.twig', $context);
} else {
    Timber::render( ['single-' . $post->post_type . '.twig', 'single.twig'], $context);
}