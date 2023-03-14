function requireAll(require) {
  require.keys().forEach(require);
}
requireAll(require.context('./templates/', true, /\.twig$/));
