<?php
/**
 * Search results page
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since   Timber 0.1
 */

use Timber\Timber;

$templates = ['search.twig', 'archive.twig', 'index.twig'];
$context = Timber::get_context();

//$context['title'] = 'Search results for ' . get_search_query();
//$context['posts'] = Timber::get_posts();

$context['search_query'] = get_search_query();
$context['products'] = Timber::get_posts(array(
    'post_type' => 'producto',
    'posts_per_page' => -1,
    's' =>  get_search_query()
));

$context['recipes'] = Timber::get_posts(array(
    'post_type' => 'receta',
    'posts_per_page' => -1,
    's' =>  get_search_query()
));

$context['posts'] = Timber::get_posts(array(
    'post_type' => 'post',
    'posts_per_page' => -1,
    's' =>  get_search_query()
));

//var_dump($context['posts']); exit();

Timber::render($templates, $context);