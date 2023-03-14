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

//Related products
$related_terms = $post->get_terms('categorias_de_producto');
$related_product_args = [
    'post_type' => 'producto', 
    'post_status'     => 'publish',
    'posts_per_page' => 4,
    'order' => 'rand',
    'post__not_in' => [$post->id]
];

$related_terms = $post->get_terms();
$related_product_args['tax_query'] = ['relation' => 'OR'];

foreach ($related_terms as $term) {
    $related_product_args['tax_query'][] = [
        'taxonomy' => 'categorias_de_producto',
        'field' => 'id',
        'terms' => array($term->id),
        'operator'  => 'IN',
    ];
}

$context['related_products'] = new \Timber\PostQuery($related_product_args);

$next_post = get_adjacent_post(true, [], false, 'categorias_de_producto');
$prev_post = get_adjacent_post(true, [], true, 'categorias_de_producto');

//var_dump($next_post); exit();

if (!is_null($next_post) && !empty($next_post)) $context['next_post'] = new TimberPost($next_post->ID);
else {
    $next_posts_args = [
        'post_type' => 'producto', 
        'post_status'     => 'publish',
        'posts_per_page' => 1,
        'order' => 'ASC',
        'order_by' => 'publish_date',
        'post__not_in' => [$post->id]
    ];

    $next_posts_args['tax_query'] = $related_product_args['tax_query'];
    $next_posts = new \Timber\PostQuery($next_posts_args);

    if ($next_posts->found_posts > 0)  $context['next_post'] = $next_posts[0];
}

if (!is_null($prev_post) && !empty($prev_post)) $context['prev_post'] = new TimberPost($prev_post->ID);
else {
    $prev_posts_args = [
        'post_type' => 'producto', 
        'post_status'     => 'publish',
        'posts_per_page' => 1,
        'order' => 'DESC',
        'order_by' => 'publish_date',
        'post__not_in' => [$post->id]
    ];

    $prev_posts_args['tax_query'] = $related_product_args['tax_query'];
    $prev_posts = new \Timber\PostQuery($prev_posts_args);

    if ($prev_posts->found_posts > 0)  $context['prev_post'] = $prev_posts[0];
}

if (post_password_required($post->ID)) {
    Timber::render('single-password.twig', $context);
} else {
    Timber::render( ['single-' . $post->post_type . '.twig', 'single.twig'], $context);
}