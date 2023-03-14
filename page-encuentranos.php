<?php
/**
 * Template Name: Template Page Encuentranos
 */
use \Timber\Post;
use Timber\Timber;
use Timber\PostQuery;

$context            = Timber::get_context();
$post               = new Post();
$context['post']    = $post;

$context['locations'] = new PostQuery([
    'post_type' => 'punto_de_venta',
    'posts_per_page' => -1,
    'post_status' => 'publish',
]);

$context['cities'] = Timber::get_terms([
    'taxonomy' => 'ciudades',
    'hide_empty' => true,
]);

Timber::render('page-encuentranos.twig', $context);