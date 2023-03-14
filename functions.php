<?php

use Timber\Timber;
use Timber\Site;

function add_img_size_attr($content){
  $pattern = '/<img [^>]*?src="(https?:\/\/[^"]+?)"[^>]*?>/iu';
  preg_match_all($pattern, $content, $imgs);
  foreach ( $imgs[0] as $i => $img ) {
    if ( false !== strpos( $img, 'width=' ) && false !== strpos( $img, 'height=' ) ) {
      continue;
    }
    $img_url = $imgs[1][$i];
    $img_size = @getimagesize( $img_url );
      
    if ( false === $img_size ) {
      continue;
    }
    $replaced_img = str_replace( '<img ', '<img ' . $img_size[3] . ' ', $imgs[0][$i] );
    $content = str_replace( $img, $replaced_img, $content );
  }
  return $content;
}
add_filter('the_content','add_img_size_attr');
if (!class_exists('Timber')) {
    add_action('admin_notices', function () {
        echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . esc_url(admin_url('plugins.php#timber')) . '">' . esc_url(admin_url('plugins.php')) . '</a></p></div>';
    });

    add_filter('template_include', function ($template) {
        return get_stylesheet_directory() . '/static/no-timber.html';
    });

    return;
}

Timber::$dirname = ['dist/templates'];

class StarterSite extends Site
{

    function __construct()
    {
        add_theme_support('post-formats', []);
        add_theme_support('post-thumbnails');
        add_theme_support('menus');
        add_theme_support('html5', ['comment-list', 'comment-form', 'search-form', 'gallery', 'caption']);
        add_filter('timber_context', [$this, 'add_to_context']);
        add_filter('get_twig', [$this, 'add_to_twig']);
        add_action('init', [$this, 'register_post_types']);
        add_action('init', [$this, 'register_taxonomies']);
        parent::__construct();
    }

    function add_to_context($context)
    {
        //General
        $front_page = new TimberPost(get_option('page_on_front'));
        $context['site'] = $this;
        //$context['front_page'] = $front_page;

        //ACF
        $context['facebook_url'] = $front_page->facebook;
        $context['instagram_url'] = $front_page->instagram;
        $context['youtube_url'] = $front_page->youtube;

        $context['footer_description'] = $front_page->get_field('descripcion_footer');
        $context['shops'] = $front_page->get_field('tiendas');
        $context['shop_title'] = $front_page->get_field('titulo_tiendas');
        $context['shop_description'] = $front_page->get_field('descripcion_corta_tiendas');

        $context['footer_links'] = $front_page->get_field('enlaces_footer');
    
        //Pages
        $context['recipe_page'] = new TimberPost(149);
        $context['product_page'] = new TimberPost(6);
        $context['contact_page'] = new TimberPost(218);

        //Menus
        $context['menu'] = new TimberMenu(2);
        $context['footer_menu'] = new TimberMenu(3);

        //product-menu
        $context['product_categories'] = Timber::get_terms([
            'taxonomy' => 'categorias_de_producto',
            'hide_empty' => true,
        ]);

        return $context;
    }

    function add_to_twig($twig) {
        /* this is where you can add your own functions to twig */
        $twig->addExtension(new Twig_Extension_StringLoader());

        $twig->addFunction( new Twig_SimpleFunction( 'admin_url', function($slug) {
            return admin_url($slug);
        }));

        $twig->addFunction(new Twig_SimpleFunction('get_file_content', function($url) {
            if (empty($url)) return '';

            if (defined('WP_DEBUG') && true === WP_DEBUG) {
                $options = [
                    "ssl"=> [
                        "verify_peer" => false,
                        "verify_peer_name" => false,
                    ],
                ]; 
            } else $options = [];
            
            return file_get_contents($url, false, stream_context_create($options));
        }));

        return $twig;
    }
}

new StarterSite();


add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('style', get_template_directory_uri() . '/dist/style.css', [], projectname_get_hash('/dist/style.css'));
    wp_enqueue_script('scripts', get_template_directory_uri() . '/dist/script.js', [], projectname_get_hash('/dist/script.js'), true);
    //wp_enqueue_script( 'youtube-iframe-api', 'https://www.youtube.com/iframe_api', array( 'jquery' ), false, true );
});

function projectname_get_hash($file)
{
    $hash = @md5_file(get_template_directory() . $file);
    if ($hash) {
        return $hash;
    }
    return null;
}

if(!function_exists('cptui_init')) {
    require 'cptui/post_types.php';
    require 'cptui/taxonomies.php';
}

add_filter('acf/settings/save_json', 'my_acf_json_save_point');
function my_acf_json_save_point( $path ) {
    $path = get_stylesheet_directory() . '/json-acf';
    return $path;
}

add_filter('acf/settings/load_json', 'my_acf_json_load_point');
function my_acf_json_load_point( $paths ) {
    unset($paths[0]);
    $paths[] = get_stylesheet_directory() . '/json-acf';
    return $paths;
}

function acf_google_map_api( $api ){
	
	$api['key'] = 'AIzaSyCzSi-VW2LuArb6V8QLM8NWpD37r4JuR6A';
	
	return $api;
	
}

add_filter('acf/fields/google_map/api', 'acf_google_map_api');


function wp_add_comment() {
    header('Content-Type: application/json');

    global $wpdb;
    $args = array();

    if (!isset($_POST['comment']) && empty($_POST['comment'])) {
        echo json_encode(['success' => false, 'error' => 'Debes escribir un comentario']);
        exit();
    } elseif (!isset($_POST['comment_post_ID']) && empty($_POST['comment_post_ID'])) {
        echo json_encode(['success' => false, 'error' => 'No es un post válido']);
        exit();
    }

    $args['comment_content'] = $_POST['comment'];
    $args['comment_post_ID'] = $_POST['comment_post_ID'];

    $post = new TimberPost($args['comment_post_ID']);
    if (!$post->ID) {
        echo json_encode(['success' => false, 'error' => 'No es un post válido']);
        exit();
    }

    if (is_user_logged_in()) {
        $user = wp_get_current_user();

        $args = array_merge($args, array(
            'comment_author' => $wpdb->escape($user->display_name),
            'comment_author_email' => $wpdb->escape($user->user_email),
            'user_id' => $user->id,
        ));
    } else {
        if (!isset($_POST['author']) && empty($_POST['author'])) {
            echo json_encode(['success' => false, 'error' => 'Debes indicar un nombre']);
            exit();
        }

        $args = array_merge($args, array(
            'name' => $wpdb->escape($_POST["name"])
        ));
    }
    
    $comment_id = wp_new_comment( $args, true );
    if (!is_wp_error( $comment_id) && isset($_POST['rating'])) {
        $rating = floatval($_POST['rating']);
        if ($rating < 0 || $rating > 5) $rating = 0;

        $user_id = null;
        if (isset($user)) $user_id = $user->id;

        save_wp_rating($comment_id, $post->ID, $rating, $user_id);
    }

    $response = [];

    if (is_wp_error( $comment_id))  $response = ['error' => $comment_id->get_error_message()];
    else {
        $rating = wp_rating_average_by_object_id($post->ID);

        $html_stars =  Timber::compile( 'partial/rating/stars.twig', ['rating' => wp_rating_average_by_object_id($post->ID)]);
        $html_comment = Timber::compile( 'partial/comment.twig', ['post' => $post, 'rating' => $rating, 'comment' => new TimberComment($comment_id)]);
        
        $response = ['success' => true, 'id' => $comment_id, 'num_comments' => count($post->comments), 'rating' => $rating, 'html' => $html_comment, 'html_stars' => $html_stars];
    }
    
    echo json_encode($response);
    exit();
}

add_action( 'wp_ajax_nopriv_wp_add_comment', 'wp_add_comment' );
add_action( 'wp_ajax_wp_add_comment', 'wp_add_comment' );


function save_wp_rating(int $comment_id, int $object_id, float $value, int $user_id = null) {
    global $wpdb;

    if ($value < 0 || $value > 5) return false;

    $rounded = round($value, 0, PHP_ROUND_HALF_DOWN);

    return $wpdb->insert( 'wp_post_rating', [
        'comment_id' => $comment_id, 
        'object_id' => $object_id, 
        'rounded' => $rounded,
        'value' => $value,
        'user_id' => $user_id
    ]) > 0;
}

function find_wp_rating_by_comment_id(int $comment_id){
    global $wpdb;

    $sql = $wpdb->prepare("SELECT pr.value FROM wp_post_rating pr WHERE comment_id = %d LIMIT 1", $comment_id);
    return $wpdb->get_var($sql) + 0;
}

function find_votes_by_object_id(int $object_id) {
    global $wpdb;

    $sql = $wpdb->prepare("SELECT SUM(1) FROM wp_post_rating pr 
        INNER JOIN  " . $wpdb->prefix . "comments c 
            ON c.comment_ID = pr.comment_id 
                WHERE pr.object_id = %d AND pr.value != 0  AND c.comment_approved = 1", $object_id);

    return intval($wpdb->get_var($sql));
}

function wp_rating_average_by_object_id(int $object_id) {
    global $wpdb;

    $sql = $wpdb->prepare("SELECT pr.object_id, pr.rounded, SUM(pr.value) sum_of_values, pr.user_id FROM wp_post_rating pr 
        INNER JOIN  " . $wpdb->prefix . "comments c 
            ON c.comment_ID = pr.comment_id 
                WHERE pr.object_id = %d AND pr.value != 0  AND c.comment_approved = 1 GROUP BY pr.rounded", $object_id);


    $votes = find_votes_by_object_id($object_id);
    $rows = $wpdb->get_results($sql);

    $total = 0;
    foreach ($rows as $key => $row) {
        $star = $key + 1;
        $total += $row->sum_of_values;
    }

    $average = 0;
    if ($total != 0) $average = $total / $votes;

    return $average;
}

add_action( 'wp_ajax_save_congratulations', 'save_congratulations');
add_action( 'wp_ajax_nopriv_save_congratulations', 'save_congratulations');
function save_congratulations() {
    global $wpdb;

    if (!isset($_POST['name'], $_POST['last_name'], $_POST['document_type'], $_POST['document'], $_POST['department'], $_POST['municipality'], $_POST['contact_number'], $_POST['email'],  $_POST['message'])) wp_send_json_error("Faltan párametros");
    if ($_POST['tycs'] !== 'SI') wp_send_json_error(["message" => "No se han aceptado las políticas de manejo y tratamiento de datos"]);

    $data = [
        'name' => $_POST['name'],
        'last_name' => $_POST['last_name'],
        'document_type' => $_POST['document_type'],
        'document' => $_POST['document'],
        'department' => $_POST['department'],
        'municipality' => $_POST['municipality'],
        'contact_number' => $_POST['contact_number'],
        'email' => $_POST['email'],
        'message' => $_POST['message'],
        'tycs' => $_POST['tycs']
    ];

    foreach ($data as $d) {
        if (empty($d))  wp_send_json_error(['message' => "Faltan párametros"]);
    }

    $attachment_url = '';

    if (is_uploaded_file($_FILES['file']['tmp_name'])) {

        $file_size_in_MB = $_FILES['file']['size'] / (1024*1024);
        if ($file_size_in_MB > 5) wp_send_json_error(['message' => 'Solo puedes subir imágenes con un peso máximo de 5 MB']);

        $file_data = wp_handle_upload($_FILES['file'], array(
            'test_form' => false,
            'mimes' => array(
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'pdf' => 'application/pdf',
            )
        ));

        if (isset($file_data['error'])) { 
            wp_send_json_error(['message' => $file_data['error']]);
        }
        elseif (!empty($file_data['url'])) {
            $attachment_url = $file_data['url'];
        }
    }

    $data['file_url'] = $attachment_url;

    $options = [];
    if (isset($_POST['message'])) {
        $data['message'] = $_POST['message'];
    }
    
    $inserted_rows = $wpdb->insert('cm_congratulations', $data);
    $last_id = $wpdb->insert_id;
    
    if ($inserted_rows == 0) {
        wp_send_json_error(['message' => '¡Ocurrió un error al enviar el formulario!']);
    }
    else {
        $motivo = 'Motivo: Quisiera enviar felicitaciones';
        $data_form =  [
            "nombres"             => $data['name'],
            "apellidos"           => $data['last_name'],
            "documento"           => $data['document_type'],
            "numero_documento"    => $data['document'],
            "pais"                => "Colombía",
            "departamento"        => $data['department'],
            "ciudad"              => $data['municipality'],
            "numero_celular"      => "+57" . $data['contact_number'],
            "correo_electronico"  => $data['email'],
            "motivo_contacto"     => $motivo . "\r\n" . $data['message'],
            "marca"               => "Pietran",
            "acepto_informacion"  => "SI",
            'imagen'              => $attachment_url,
            "url"                 => get_permalink(intval($_POST['post_id'])),
            "agencia"             => 1009031
        ];

        $response = save_form_in_gnutresauat($data_form);
        if (!isset($response->response) || $response->response->status != 'OK') {
            wp_send_json_error(['message' => '¡Ocurrió un error al enviar el formulario!']);
        } else {
            wp_send_json_success(['id' => $last_id, 'message' => 'Tu opinión es muy importante para nosotros, el mensaje se ha enviado con éxito y se ha creado con el radicado #' . $response->case_number]);
        }
    }
}

add_action( 'wp_ajax_save_suggestion', 'save_suggestion');
add_action( 'wp_ajax_nopriv_save_suggestion', 'save_suggestion');
function save_suggestion() {

    global $wpdb;

    if (!isset($_POST['name'], $_POST['last_name'], $_POST['document_type'], $_POST['document'], $_POST['department'], $_POST['municipality'], $_POST['contact_number'], $_POST['email'],  $_POST['message'])) wp_send_json_error("Faltan párametros");
    if ($_POST['tycs'] !== 'SI') wp_send_json_error(['message' => "No se han aceptado las políticas de manejo y tratamiento de datos"]);

    $data = [
        'name' => $_POST['name'],
        'last_name' => $_POST['last_name'],
        'document_type' => $_POST['document_type'],
        'document' => $_POST['document'],
        'department' => $_POST['department'],
        'municipality' => $_POST['municipality'],
        'contact_number' => $_POST['contact_number'],
        'email' => $_POST['email'],
        'message' => $_POST['message'],
        'tycs' => $_POST['tycs']
    ];

    foreach ($data as $d) {
        if (empty($d))  wp_send_json_error(['message' => "Faltan parametros"]);
    }

    $attachment_url = '';

    if (is_uploaded_file($_FILES['file']['tmp_name'])) {

        $file_size_in_MB = $_FILES['file']['size'] / (1024*1024);
        if ($file_size_in_MB > 5) wp_send_json_error(['message' => 'Solo puedes subir imágenes con un peso máximo de 5 MB']);

        $file_data = wp_handle_upload($_FILES['file'], array(
            'test_form' => false,
            'mimes' => array(
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'pdf' => 'application/pdf',
            )
        ));

        if (isset($file_data['error'])) { 
            wp_send_json_error(['message' => $file_data['error']]);
        }
        elseif (!empty($file_data['url'])) {
            $attachment_url = $file_data['url'];
        }
    }

    $data['file_url'] = $attachment_url;

    $options = [];
    if (isset($_POST['message'])) {
        $data['message'] = $_POST['message'];
    }
    
    $inserted_rows = $wpdb->insert('cm_suggestions', $data);
    $last_id = $wpdb->insert_id;
    
    if ($inserted_rows == 0) {
        wp_send_json_error(['message' => '¡Ocurrió un error al enviar el formulario!']);
    }
    else {
        $motivo = 'Motivo: Sugerencia';
        $data_form =  [
            "nombres"             => $data['name'],
            "apellidos"           => $data['last_name'],
            "documento"           => $data['document_type'],
            "numero_documento"    => $data['document'],
            "pais"                => "Colombía",
            "departamento"        => $data['department'],
            "ciudad"              => $data['municipality'],
            "numero_celular"      => "+57" . $data['contact_number'],
            "correo_electronico"  => $data['email'],
            "motivo_contacto"     => $motivo . "\r\n" . $data['message'],
            "marca"               => "Pietran",
            'imagen'              => $attachment_url,
            "url"                 => get_permalink(intval($_POST['post_id'])),
            "acepto_informacion"  => "SI",
            "agencia"             => 1009031
        ];

        $response = save_form_in_gnutresauat($data_form);
        if (!isset($response->response) || $response->response->status != 'OK') {
            wp_send_json_error(['message' => '¡Ocurrió un error al enviar el formulario!']);
        } else {
            wp_send_json_success(['id' => $last_id, 'message' => 'Tu mensaje se ha enviado con éxito y se ha creado con el radicado #' . $response->case_number]);
        }
    }
}

function save_form_in_gnutresauat($data_form, $is_dev = false) {
    //staging area
    
    if ($is_dev) { // DEV
        $token_url = 'https://gnutresauat.sugarondemand.com/rest/v10/oauth2/token';
        $credentials = [
            "grant_type"    => "password",
            "client_id"     => "ttapiexternos",
            "client_secret" => "Nutresa2018*",
            "username"      => "usrIntgEXT",
            "password"      => "Nutresa2018*",
            "platform"      => "mobile"
        ];

        //url wetocase para staging area
        $url = "https://gnutresauat.sugarondemand.com/rest/v10/webtocase";
    } else { //PROD
        $token_url = 'https://gnutresa.sugarondemand.com/rest/v10/oauth2/token';
        $credentials = [
            "grant_type"    => "password",
            "client_id"     => "TTACintegr02",
            "client_secret" => "2743AC7D",
            "username"      => "TTSSapiexter",
            "password"      => "Nutresa2018*",
            "platform"      => "mobile"
        ];

        //url wetocase para producción
        $url = "https://gnutresa.sugarondemand.com/rest/v10/webtocase";
    }

    $credentials = json_encode($credentials);
    $ch = curl_init($token_url);

    curl_setopt($ch, CURLOPT_POSTFIELDS, $credentials);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $token = curl_exec($ch);

    curl_close($ch);

    $data = [
        "fields" =>[
            "sasa_abreviaturasociedad_c"                              => "AANN",
            "sasa_sociedad_por_cuenta"                                => "b3313166-1c88-11e7-a7d7-06646c93d527",
            "account_id"                                              => "000000000000",
            "sasa_relacion_c"                                         => 4,
            "sasa_fuente_c"                                           => 9,
            "team_set_id"                                             => "140597cc-001c-11e7-911a-02b215474f0b",
            "team_id"                                                 => "140597cc-001c-11e7-911a-02b215474f0b",
            "sasa_tificacion_casos_cases_1sasa_tificacion_casos_ida"  => "0b59b2fc-8a88-11e6-8d46-06b20b8677ed",
            "type"                                                    => "webtocasealimentoscarnicos",
        ],

        "description" => $data_form
    ];

    $tok = json_decode($token);
    
    $json_data = json_encode($data);
    $ch = curl_init($url);
    
    curl_setopt( $ch, CURLOPT_POSTFIELDS, $json_data );
    curl_setopt( $ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json', "oauth-token: " . $tok->access_token ));
    curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );

    $caso = curl_exec($ch);
    curl_close($ch);

    return json_decode($caso);
}


/**
 * Allow changing or removing the Breadcrumb items
 *
 * @param array       $crumbs The crumbs array.
 * @param Breadcrumbs $this   Current breadcrumb object.
 */
add_filter( 'rank_math/frontend/breadcrumb/items', function( $crumbs, $class ) {
    $context = Timber::get_context();

    if(is_singular('receta')){
        $recipe_page    = $context['recipe_page'];
        $value[] = array(
            'Recetas', 
                    $recipe_page->link(),
                    'hide_in_schema' => false
            );
        array_splice( $crumbs, 1, 0, $value ); 
        return $crumbs; 
    }

    if(is_singular('producto')){
        $product_page   = $context['product_page'];
        $value[] = array(
            'Productos', 
                    $product_page->link(),
                    'hide_in_schema' => false
            );
        array_splice( $crumbs, 1, 0, $value ); 
        return $crumbs; 
    }

    if(is_singular('post')){
        unset($crumbs[1]);
        $page_for_posts = new TimberPost(get_option( 'page_for_posts' ));

        $value[] = array(
            $page_for_posts->title, 
                    $page_for_posts->link(),
                    'hide_in_schema' => false
            );
        array_splice( $crumbs, 1, 0, $value ); 
        return $crumbs; 
    }

    if(is_tax('categorias_de_producto')){
        $product_page    = $context['product_page'];
        unset($crumbs[1]);
        $crumbs     = array_values($crumbs);
        $value[]    = array(
            'Productos', 
                    $product_page->link(),
                    'hide_in_schema' => false
            );
        array_splice( $crumbs, 1, 0, $value ); 
        return $crumbs; 
    }

    return $crumbs;
}, 10, 2);


function async_products_by_category() {
    header('Content-Type: application/json');

    if (!isset($_REQUEST['category_id'])) {
        echo json_encode(['success' => false, 'error' => 'Categoría no válida']);
        exit();
    }

    $category_id = intval($_REQUEST['category_id']);
    $products = Timber::get_posts([
        'post_type' => 'producto',
        'post_status' => array('publish'),
        'posts_per_page' => -1,
        'tax_query' => [
            [
                'taxonomy' => 'categorias_de_producto',
                'field' => 'id',
                'terms' => array($category_id),
                'operator'  => 'IN',
            ]
        ]
    ]);


    $recipes = new \Timber\PostQuery([
        'post_type' => 'receta',
        'post_status' => array('publish'),
        'orderby' => 'date',
        'order' => 'asc',
        'tax_query' => [
            [
                'taxonomy' => 'categorias_de_producto',
                'field' => 'id',
                'terms' => array($category_id),
                'operator'  => 'IN',
            ]
        ]
    ]);

    $recipe_html = Timber::compile( 'partial/recipes/filtered-recipes.twig', ['recipes' => $recipes]);

    $mobile_html = Timber::compile( 'partial/recipes/chk-product-items.twig', ['products' => $products, 'is_mobile' => true]);
    $desktop_html = Timber::compile( 'partial/recipes/chk-product-items.twig', ['products' => $products, 'is_mobile' => false]);

    echo json_encode(['success' => true, 'recipe_html' => $recipe_html, 'mobile_html' => $mobile_html, 'desktop_html' => $desktop_html]);
    exit();
}

add_action( 'wp_ajax_nopriv_async_products_by_category', 'async_products_by_category' );
add_action( 'wp_ajax_async_products_by_category', 'async_products_by_category' );

function async_recipe_filter() {
    header('Content-Type: application/json');

    if (isset($_POST['page']) && is_numeric($_POST['page'])) $paged = intval($_POST['page']);
    else if (!isset($paged) || !$paged) $paged = 1;

    $args = [
        'post_type' => 'receta',
        'post_status' => array('publish'),
        'paged' => $paged,
        'order' => 'asc',
        'orderby' => 'date',
    ];

    if (count($_POST['products']) > 0) {
        $args['meta_query']['relation'] = 'OR';

        foreach ($_POST['products'] as $product) {
            $args['meta_query'][] = array(
                'key' => 'productos_relacionados',
                'value' => $product,
                'compare' => 'LIKE',
            );
        }
    }

    $args['tax_query']['relation'] = 'OR';
    if (count($_POST['moments']) > 0) {
        foreach ($_POST['moments'] as $moment) {
            $args['tax_query'][] = array(
                'taxonomy' => 'momentos',
                'field' => 'id',
                'terms' => $moment,
                'operator'  => 'IN'
            );
        }
    }

    if (count($_POST['preparations']) > 0) {
        foreach ($_POST['preparations'] as $preparation) {
            $args['tax_query'][] = array(
                'taxonomy' => 'tipos_de_preparacion',
                'field' => 'id',
                'terms' => $preparation,
                'operator'  => 'IN'
            );
        }
    }

    if (isset($_POST['category_id']) && !empty($_POST['category_id'])) {
        $args['tax_query'][] = array(
            'taxonomy' => 'categorias_de_producto',
            'field' => 'id',
            'terms' => array(intval($_POST['category_id'])),
            'operator'  => 'IN',
        );   
    }
    

    if (isset($_POST['order']) && $_POST['order'] == 'asc') {
        $args['order'] = 'ASC';
        $args['orderby'] = 'title';
    } elseif (isset($_POST['order']) && $_POST['order'] == 'desc') {
        $args['order'] = 'desc';
        $args['orderby'] = 'title';
    }

    $recipes =  new \Timber\PostQuery($args);
    $context = Timber::get_context();
    $context['recipes'] = $recipes;
    $html = Timber::compile( 'partial/recipes/filtered-recipes.twig', $context);

    echo json_encode(['success' => true, 'html' => $html]);

    exit();
}

add_action( 'wp_ajax_nopriv_async_recipe_filter', 'async_recipe_filter' );
add_action( 'wp_ajax_async_recipe_filter', 'async_recipe_filter' );


function async_related_products_by_category($category_id) {
    header('Content-Type: application/json');

    $args = [
        'post_type' => 'producto',
        'posts_per_page' => 3,
        'orderby' => 'rand'
    ];

    if (isset($_REQUEST['category_id'])) {
        $category_id = intval($_REQUEST['category_id']);
        $args['tax_query'][] =  [
            [
                'taxonomy' => 'categorias_de_producto',
                'field' => 'id',
                'terms' => array($category_id),
                'operator'  => 'IN',
            ]
        ];
    }

    $related_products = new \Timber\PostQuery($args);

    $context = Timber::get_context();
    $context['related_products'] =  $related_products;
    $html = Timber::compile( 'partial/products/related-items.twig', $context);

    echo json_encode(['success' => true, 'html' => $html]);
    exit();
}
add_action( 'wp_ajax_nopriv_async_related_products_by_category', 'async_related_products_by_category' );
add_action( 'wp_ajax_async_related_products_by_category', 'async_related_products_by_category' );

function async_news_by_category() {
    header('Content-Type: application/json');

    $args = [
        'post_type' => 'post',
        //'posts_per_page' => 1
    ];

    if (isset($_REQUEST['category_id'])) {
        $category_id = intval($_REQUEST['category_id']);
        $args['cat'] = $_REQUEST['category_id'];
    }

    if (isset($_POST['order']) && $_POST['order'] == 'asc') {
        $args['order'] = 'ASC';
    } elseif (isset($_POST['order']) && $_POST['order'] == 'desc') {
        $args['order'] = 'desc';
    }

    if (isset($_POST['page']) && is_numeric($_POST['page'])) $args['paged'] = intval($_POST['page']);
    else if (!isset($paged) || !$paged) $args['paged'] = 1;

    $news = new \Timber\PostQuery($args);
    $html = Timber::compile( 'partial/news/news-items.twig', ['news' => $news]);

    echo json_encode(['success' => true, 'html' => $html]);
    exit();
}

add_action( 'wp_ajax_nopriv_async_news_by_category', 'async_news_by_category' );
add_action( 'wp_ajax_async_news_by_category', 'async_news_by_category' );

function random_gen($min, $max, $quantity, $step = 1) {
    $numbers = range($min, $max, $step);
    shuffle($numbers);

    return array_slice($numbers, 0, $quantity);
}

function random_top_and_left($quantity) {
    $random['top'] = random_gen(0, 100, $quantity, 10);
    $random['left'] = random_gen(0, 80, $quantity, 4);

    return $random;
}

add_action( 'wp_ajax_save_consumer_report', 'save_consumer_report');
add_action( 'wp_ajax_nopriv_save_consumer_report', 'save_consumer_report');
function save_consumer_report() {
    global $wpdb;

    if (!isset($_POST['full_name'], $_POST['document_type'], $_POST['document'], $_POST['department'], $_POST['municipality'], 
        $_POST['neighborhood'], $_POST['address'], $_POST['landline_number'], $_POST['cell_phone'], $_POST['email'])) wp_send_json_error("Faltan párametros en el paso 1");
    
    if (!isset($_POST['product'], $_POST['product_defect'], $_POST['expiration_date'], $_POST['lot_number'], $_POST['defective_quantities'], $_POST['sample'], $_POST['shop_place'], $_POST['tycs'])) wp_send_json_error("Faltan párametros en el paso 2");

    if ($_POST['tycs'] !== 'SI') wp_send_json_error(["message" => "No se han aceptado los términos y condiciones"]);

    $attachment_urls = [];
    $files = [];

    if (isset($_FILES['attachments']) && count($_FILES['attachments']['name']) > 0) {
        if (count($_FILES['attachments']['name']) > 4) {
            wp_send_json_error(['message' => 'Máximo 4 imágenes']);
        }

        $files = rearrangeFiles($_FILES['attachments']);
    }

    $allowed_file_types = array('image/jpg', 'image/jpeg', 'image/gif', 'image/png');
    foreach ($files as $attachment) {
        //$mime_type = mime_content_type($attachment['tmp_name']);
        $mime_type = $attachment['type'];
        if ($attachment['size'] == 0) continue;

        if (!in_array($mime_type, $allowed_file_types)) {
            wp_send_json_error(['message' => 'Solo puedes subir imágenes en formato jpg, jpeg, png con un peso máximo de 5 MB']);
        } 
        
        $fileSizeInMB = $attachment['size'] / (1024*1024);
        if ($fileSizeInMB > 5) {
            wp_send_json_error(['message' => 'Solo puedes subir imágenes en formato jpg, jpeg, png con un peso máximo de 5 MB']);
        }
    }

    $product_images = [];
    foreach ($files as $key => $attachment) {
        if ($attachment['size'] == 0) continue;

        $file_data = wp_handle_upload($attachment, array(
            'test_form' => false
        ));

        if (isset($file_data['error'])) { 
            wp_send_json_error(['message' => $file_data['error']]);
        }
        else {
            $attachment_urls[] = $file_data['url'];
            $product_images['imagen_producto' . (intval($key) + 1)] = $file_data['url'];
        }
    }

    $data = [
        'full_name' => $_POST['full_name'],
        'document_type' => $_POST['document_type'],
        'document' => $_POST['document'],
        'department' => $_POST['department'],
        'municipality' => $_POST['municipality'],
        'neighborhood' => $_POST['neighborhood'],
        'address' => $_POST['address'],
        'landline_number' => $_POST['landline_number'],
        'cell_phone' => $_POST['cell_phone'],
        'email' => $_POST['email'],
        'product' => $_POST['product'],
        'product_defect' => $_POST['product_defect'],
        'expiration_date' => $_POST['expiration_date'],
        'lot_number' => $_POST['lot_number'],
        'defective_quantities' => $_POST['defective_quantities'],
        'sample' => $_POST['sample'],
        'shop_place' => $_POST['shop_place'],
        'tycs' => $_POST['tycs'],
    ];

    foreach ($data as $d) {
        if (empty($d))  wp_send_json_error(["message" => "Faltan párametros"]);
    }

    $data['files'] =  implode(',', $attachment_urls);
    $data['message'] = $_POST['message'];
    
    $inserted_rows = $wpdb->insert('cm_consumer_report', $data);
    $last_id = $wpdb->insert_id;
    
    if ($inserted_rows == 0) {
        wp_send_json_error(['message' => '¡Ocurrió un error al enviar el formulario!']);
    }
    else {
        $motivo = 'Motivo: Soy un consumidor y tengo novedades con un producto Pietran';
        
        $data_form =  [
            "nombres"             => $data['full_name'],
            "apellidos"           => "",
            "documento"           => $data['document_type'],
            "numero_documento"    => $data['document'],
            "pais"                => "Colombía",
            "departamento"        => $data['department'],
            "ciudad"              => $data['municipality'],
            "barrio"              => $data['neighborhood'],
            "direccion"           => $data['address'],
            "telefono"            => $data['landline_number'],
            "numero_celular"      => "+57" . $data['cell_phone'],
            "correo_electronico"  => $data['email'] ,
            "producto"            => $data['product'] ,
            "defecto_producto"    => $data['product_defect'] ,
            "fecha_vencimiento"   => $data['expiration_date'] ,
            "numero_lote"         => $data['lot_number'] ,
            "cantidades_defectuosas"=> $data['defective_quantities'] ,
            "conserva_muestra"    => $data['sample'],
            "lugar_compra"        => $data['shop_place'],
            "motivo_contacto"     => $motivo . "\r\n" . $data['message'],
            "marca"               => "Pietran",
            "acepto_informacion"  => "SI",
            "acepto_habeas"       => $_POST['tycs'],
            "url"                 => get_permalink(intval($_POST['post_id'])),
            "agencia"             => 1009031
        ];

        $data_form = array_merge($data_form, $product_images);

        $response = save_form_in_gnutresauat($data_form);
        if (!isset($response->response) || $response->response->status != 'OK') {
            wp_send_json_error(['message' => '¡Ocurrió un error al enviar el formulario!']);
        } else {
            wp_send_json_success(['id' => $last_id, 'message' => 'Tu mensaje se ha enviado con éxito y se ha creado con el radicado #' . $response->case_number]);
        }
    }

    exit();
}

add_action( 'wp_ajax_save_new_seller', 'save_new_seller' );
add_action( 'wp_ajax_nopriv_save_new_seller', 'save_new_seller' );
function save_new_seller() {
    global $wpdb;

    if (!isset($_POST['name'], $_POST['comercial_establishment'], $_POST['document_type'], $_POST['document'], $_POST['department'], $_POST['municipality'], 
        $_POST['neighborhood'], $_POST['address'], $_POST['landline_number'], $_POST['cell_phone'], $_POST['email'])) wp_send_json_error("Faltan párametros");
    
    if (!isset($_POST['business_type'], $_POST['operating_time'], $_POST['exhibicion'], $_POST['number_of_cash_registers'], $_POST['document_type'], $_POST['tycs'])) wp_send_json_error("Faltan párametros");

    if ($_POST['tycs'] !== 'SI') wp_send_json_error("No se han aceptado los términos y condiciones");

    $data = [
        'name' => $_POST['name'],
        'comercial_establishment' => $_POST['comercial_establishment'],
        'document_type' => $_POST['document_type'],
        'document' => $_POST['document'],
        'department' => $_POST['department'],
        'municipality' => $_POST['municipality'],
        'neighborhood' => $_POST['neighborhood'],
        'address' => $_POST['address'],
        'cell_phone' => $_POST['cell_phone'],
        'email' => $_POST['email'],
        'business_type' => $_POST['business_type'],
        'operating_time' => $_POST['operating_time'],
        'exhibicion' => $_POST['exhibicion'],
        'number_of_cash_registers' => $_POST['number_of_cash_registers'],
        'tycs' => $_POST['tycs']
    ];

    foreach ($data as $d) {
        if (empty($d))  wp_send_json_error(["message" => "Faltan párametros"]);
    }

    if (isset($_POST['observations'])) {
        $data['observations'] = $_POST['observations'];
    }
    
    $data['landline_number'] =  $_POST['landline_number'];

    $inserted_rows = $wpdb->insert('cm_new_sellers', $data);

    $last_id = $wpdb->insert_id;
    
    if ($inserted_rows == 0) {
        wp_send_json_error(['message' => '¡Ocurrió un error al enviar el formulario!']);
    }
    else {
        $motivo = 'Motivo: Quisiera vender productos Pietran en mi negocio';
        $data_form =  [
            "nombres"             => $data['name'],
            "apellidos"           => "",
            "establecimiento"     => $data['comercial_establishment'],
            "documento"           => $data['document_type'],
            "numero_documento"    => $data['document'],
            "correo_electronico"  => $data['email'],
            "pais"                => "Colombía",
            "departamento"        => $data['department'],
            "ciudad"              => $data['municipality'],
            "barrio"              => $data['neighborhood'],
            "direccion"           => $data['address'],
            "telefono"            => $data['landline_number'],
            "numero_celular"      => "+57" . $data['phone_number'],

            "motivo_contacto"     => $motivo,
            "tipo_negocio"        => $data['business_type'],
            "tiempo_negocio"      => $data['operating_time'],
            "cajas_registradoras" => $data['number_of_cash_registers'],
            "exhibicion"          => $data['exhibicion'],
            "comentario"          => $data['observations'],

            "marca"               => "Pietran",
            "acepto_informacion"  => "SI",
            "acepto_habeas"       => $_POST['tycs'],
            "url"                 => get_permalink(intval($_POST['post_id'])),
            "agencia"             => 1009031

        ];
        
        $response = save_form_in_gnutresauat($data_form);

        if (!isset($response->response) || $response->response->status != 'OK') {
            wp_send_json_error(['message' => '¡Ocurrió un error al enviar el formulario!']);
        } else {
            wp_send_json_success(['id' => $last_id, 'message' => 'Tu mensaje se ha enviado con éxito y se ha creado con el radicado #' . $response->case_number]);
        }
    }
}

add_action( 'wp_ajax_save_service_report', 'save_service_report');
add_action( 'wp_ajax_nopriv_save_service_report', 'save_service_report');
function save_service_report() {
    global $wpdb;

    if (!isset($_POST['name'], $_POST['comercial_establishment'], $_POST['document_type'], $_POST['document'], $_POST['department'], $_POST['municipality'], 
        $_POST['address'], $_POST['contact_number'], $_POST['email'], $_POST['tycs'])) wp_send_json_error(["message" => "Faltan párametros"]);

    if ($_POST['tycs'] !== 'SI') wp_send_json_error(["message" => "No se han aceptado los términos y condiciones"]);

    $attachment_urls = [];
    $files = [];

    if (isset($_FILES['attachments']) && count($_FILES['attachments']['name']) > 0) {
        if (count($_FILES['attachments']['name']) > 4) {
            wp_send_json_error(['message' => 'Máximo 4 imágenes']);
        }

        $files = rearrangeFiles($_FILES['attachments']);
    } 

    $allowed_file_types = array('image/jpg', 'image/jpeg', 'image/gif', 'image/png');

    foreach ($files as $attachment) {
        $mime_type = $attachment['type'];
        if ($attachment['size'] == 0) continue;

        if (!in_array($mime_type, $allowed_file_types)) {
            wp_send_json_error(['message' => 'Solo puedes subir imágenes en formato jpg, jpeg, png con un peso máximo de 5 MB']);
        } 
        
        $fileSizeInMB = $attachment['size'] / (1024*1024);
        if ($fileSizeInMB > 5) {
            wp_send_json_error(['message' => 'Solo puedes subir imágenes en formato jpg, jpeg, png con un peso máximo de 5 MB']);
        }
    }
    
    $product_images = [];
    foreach ($files as $key => $attachment) {
        if ($attachment['size'] == 0) continue;

        $file_data = wp_handle_upload($attachment, array(
            'test_form' => false
        ));

        if (isset($file_data['error'])) { 
            wp_send_json_error(['message' => $file_data['error']]);
        }
        elseif (!empty($file_data['url'])) {
            $attachment_urls[] = $file_data['url'];
            $product_images['imagen_producto' . (intval($key) + 1)] = $file_data['url'];
        }
    }
    
    $data = [
        'name' => $_POST['name'],
        'comercial_establishment' => $_POST['comercial_establishment'],
        'document_type' => $_POST['document_type'],
        'document' => $_POST['document'],
        'department' => $_POST['department'],
        'municipality' => $_POST['municipality'],
        'address' => $_POST['address'],
        'contact_number' => $_POST['contact_number'],
        'email' => $_POST['email'],
        'tycs' => $_POST['tycs']
    ];

    foreach ($data as $d) {
        if (empty($d))  wp_send_json_error(["message" => "Faltan párametros"]);
    }

    $data['files'] =  implode(',', $attachment_urls);
    $data['landline_number'] =  $_POST['landline_number'];
    $data['code'] = $_POST['code'];
    $data['message'] = $_POST['message'];

    $inserted_rows = $wpdb->insert('cm_service_report', $data);
    $last_id = $wpdb->insert_id;
    
    if ($inserted_rows == 0) {
        wp_send_json_error(['message' => '¡Ocurrió un error al enviar el formulario!']);
    }
    else {
        $motivo   = 'Motivo: Tengo novedades con el servicio o productos de Pietran en mi negocio';
        
        $data_form =  [
            "nombres"             => $data['name'],
            "apellidos"           => "",
            "establecimiento"     => $data['comercial_establishment'],
            "documento"           => $data['document_type'],
            "numero_documento"    => $data['document'],
            "codigo"              => $data['code'],
            "pais"                => "Colombía",
            "departamento"        => $data['department'],
            "ciudad"              => $data['municipality'],
            "direccion"           => $data['address'],
            "correo_electronico"  => $data['email'] ,
            "telefono"            => $data['landline_number'],
            "numero_celular"      => "+57" . $data['contact_number'],
            "motivo_contacto"     => $motivo . "\r\n" . $data['message'],
            "marca"               => "Pietran",
            "acepto_informacion"  => "SI",
            "acepto_habeas"       => $_POST['tycs'],
            "url"                 => get_permalink(intval($_POST['post_id'])),
            "agencia"             => 1009031
        ];

        $data_form = array_merge($data_form, $product_images);

        $response = save_form_in_gnutresauat($data_form);

        if (!isset($response->response) || $response->response->status != 'OK') {
            wp_send_json_error(['message' => '¡Ocurrió un error al enviar el formulario!']);
        } else {
            wp_send_json_success(['id' => $last_id, 'message' => 'Tu mensaje se ha enviado con éxito y se ha creado con el radicado #' . $response->case_number]);
        }
    }
}

add_action( 'wp_ajax_save_information', 'save_information');
add_action( 'wp_ajax_nopriv_save_information', 'save_information');
function save_information() {
    global $wpdb;

    if (!isset($_POST['full_name'], $_POST['document_type'], $_POST['document'], $_POST['department'], $_POST['municipality'], $_POST['phone_number'], $_POST['email'])) wp_send_json_error("Faltan párametros");
    if ($_POST['tycs'] !== 'SI') wp_send_json_error("No se han aceptado los términos y condiciones");

    $data = [
        'full_name' => $_POST['full_name'],
        'document_type' => $_POST['document_type'],
        'document' => $_POST['document'],
        'department' => $_POST['department'],
        'municipality' => $_POST['municipality'],
        'phone_number' => $_POST['phone_number'],
        'email' => $_POST['email'],
        'tycs' => $_POST['tycs']
    ];

    foreach ($data as $d) {
        if (empty($d))  wp_send_json_error(['message' => 'Faltan párametros']);
    }

    if (isset($_POST['message'])) {
        $data['message'] = $_POST['message'];
    }
    
    $inserted_rows = $wpdb->insert('cm_information', $data);
    $last_id = $wpdb->insert_id;
    
    if ($inserted_rows == 0) {
        wp_send_json_error(['message' => '¡Ocurrió un error al enviar el formulario!']);
    }
    else {
        $motivo = 'Motivo: Necesito Información';
        
        $data_form =  [
            "nombres"             => $data['full_name'],
            "apellidos"           => "",
            "documento"           => $data['document_type'],
            "numero_documento"    => $data['document'],
            "pais"                => "Colombía",
            "departamento"        => $data['department'],
            "ciudad"              => $data['municipality'],
            "numero_celular"      => "+57" . $data['phone_number'],
            "correo_electronico"  =>  $data['email'],
            "motivo_contacto"     => $motivo . "\r\n" . $data['message'],
            "marca"               => "Pietran",
            "acepto_informacion"  => "SI",
            "acepto_habeas"       => $data['tycs'],
            "url"                 => get_permalink(intval($_POST['post_id'])),
            "agencia"             => 1009031
        ];

        $response = save_form_in_gnutresauat($data_form);
        if (!isset($response->response) || $response->response->status != 'OK') {
            wp_send_json_error(['message' => '¡Ocurrió un error al enviar el formulario!']);
        } else {
            wp_send_json_success(['id' => $last_id, 'message' => 'Tu mensaje se ha enviado con éxito y se ha creado con el radicado #' . $response->case_number]);
        }
    }
}

function rearrangeFiles($arr) {
    foreach($arr as $key => $all) {
        foreach($all as $i => $val) {
            $new_array[$i][$key] = $val;    
        }    
    }
    return $new_array;
}

function url_from_iframe($iframe_string) {
    preg_match('/src="([^"]+)"/', $iframe_string, $match);
    return $match[1];
}

add_action( 'pre_get_posts', 'na_parse_request' );
function na_parse_request( $query ) {
    if ( ! $query->is_main_query() || 2 != count( $query->query ) || ! isset( $query->query['page'] ) ) {
        return;
    }
    if ( ! empty( $query->query['name'] ) ) {
        $query->set( 'post_type', array( 'post', 'receta', 'page' ) );
    }
}



function async_recetas_filter() {
    /*header('Content-Type: application/json');*/

    $data = json_decode($_POST['jsonString']);
    $resp = json_decode($_REQUEST['jsonString']);

    $data = json_decode($_REQUEST['jsonString'],true); 
//print_f($data); // return data in associative array.
    
    

    echo json_encode("Daniel: ".$data);
    exit();

    if (isset($_POST['page']) && is_numeric($_POST['page'])) $paged = intval($_POST['page']);
    else if (!isset($paged) || !$paged) $paged = 1;

    $args = [
        'post_type' => 'receta',
        'post_status' => array('publish'),
        'paged' => $paged,
        'order' => 'asc',
        'orderby' => 'date',
    ];

    if (count($_POST['products']) > 0) {
        $args['meta_query']['relation'] = 'OR';

        foreach ($_POST['products'] as $product) {
            $args['meta_query'][] = array(
                'key' => 'productos_relacionados',
                'value' => $product,
                'compare' => 'LIKE',
            );
        }
    }

    $args['tax_query']['relation'] = 'OR';
    if (count($_POST['moments']) > 0) {
        foreach ($_POST['moments'] as $moment) {
            $args['tax_query'][] = array(
                'taxonomy' => 'momentos',
                'field' => 'id',
                'terms' => $moment,
                'operator'  => 'IN'
            );
        }
    }

    if (count($_POST['preparations']) > 0) {
        foreach ($_POST['preparations'] as $preparation) {
            $args['tax_query'][] = array(
                'taxonomy' => 'tipos_de_preparacion',
                'field' => 'id',
                'terms' => $preparation,
                'operator'  => 'IN'
            );
        }
    }

    if (isset($_POST['category_id']) && !empty($_POST['category_id'])) {
        $args['tax_query'][] = array(
            'taxonomy' => 'categorias_de_producto',
            'field' => 'id',
            'terms' => array(intval($_POST['category_id'])),
            'operator'  => 'IN',
        );   
    }
    

    if (isset($_POST['order']) && $_POST['order'] == 'asc') {
        $args['order'] = 'ASC';
        $args['orderby'] = 'title';
    } elseif (isset($_POST['order']) && $_POST['order'] == 'desc') {
        $args['order'] = 'desc';
        $args['orderby'] = 'title';
    }

    $recipes =  new \Timber\PostQuery($args);
    $context = Timber::get_context();
    $context['recipes'] = $recipes;
    $html = Timber::compile( 'partial/recipes/filtered-recipes.twig', $context);

    echo json_encode(['success' => true, 'html' => $html]);

    exit();
}

add_action( 'wp_ajax_nopriv_async_recetas_filter', 'async_recetas_filter' );
add_action( 'wp_ajax_async_recetas_filter', 'async_recetas_filter' );