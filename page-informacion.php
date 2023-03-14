<?php
/**
 * Template Name: Template Page Información
 */
use \Timber\Post;
use Timber\Timber;
use Timber\PostQuery;

$context            = Timber::get_context();
$post               = new Post();
$context['post']    = $post;

Timber::render('page-informacion.twig', $context);