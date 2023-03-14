<?php
/**
 * Template Name: Template Page Novedades
 */
use \Timber\Post;
use Timber\Timber;
use Timber\PostQuery;

$context            = Timber::get_context();
$post               = new Post();
$context['post']    = $post;

Timber::render('page-contacto-novedades.twig', $context);