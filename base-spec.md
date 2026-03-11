# Poke API - Especificación de la aplicación

1. Listado de todos los Pokémon: nombre, generación, tipos... ordenados por id
   La página principal del proyecto deberá ser un listado de todos los Pokémon, ordenados por id (por defecto). El listado debe mostrar al menos, por cada Pokémon: nombre, generación a la que pertenece y sus tipos. Adicionalmente, se puede pintar cualquier otra información que resulte relevante.

2. Filtros en el listado: tipo y generación
   Se deben añadir dos selectores en el buscador para filtrar el listado por Tipo y Generación.

3. Buscador por nombre: filtro en tiempo real, incluyendo evoluciones
   Añadir un buscador de texto que filtre el listado por los nombres de los Pokémon. El buscador debe funcionar en tiempo real, es decir, debe ir filtrando el listado a medida que el usuario escribe. El buscador debe encontrar tanto los Pokémon que coincidan con el texto de búsqueda y sus evoluciones. Es decir, si buscamos Pikachu, deberán aparecer también Pichu y Raichu.

4. Página de información de cada Pokémon: nombre, imagen, generación, tipos, evoluciones, stats...
   Al hacer click en un Pokémon del listado, debemos navegar a una página con la información del Pokémon. En esta página debemos visualizar, al menos la siguiente información:
    - Nombre
    - Imagen
    - Generación
    - Tipos
    - Evoluciones (con sus imágenes)
    - Stats

    Al hacer click en una de las evoluciones navegaremos a la página de ese Pokémon. La evolución actual siempre debe estar marcada de algún modo, para saber que estamos en la página de ese Pokémon.

    **Nota**: Al volver al listado desde cualquier página se debe mantener el estado del mismo, así como los filtros y el contenido del buscador (no es necesario que se mantenga esta información si recargamos la página).
