<?php
/**
 * Template Name: Template Page Mi Mundo Saludable
 * 
 * The main template file
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since   Timber 0.1
 */

/**
 * 
 */
use \Timber\Post;
use Timber\Timber;
use Timber\PostQuery;

$context            = Timber::get_context();
$post               = new Post();
$context['post']    = $post;

$context['categories'] = Timber::get_terms('category');

$context['news'] = new PostQuery(array(
    'post_status' => array('publish'),
    'post_type' => 'post',
    //'posts_per_page' => 1,
));

$templates = ['page-mundo-saludable.twig'];
Timber::render($templates, $context);