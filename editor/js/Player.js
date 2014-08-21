var Player = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setPosition( 'absolute' );
	container.setDisplay( 'none' );

	//

	var camera, scene, renderer;
	var scripts;

	//

	var load = function ( json ) {

		if ( renderer !== undefined ) {

			container.dom.removeChild( renderer.domElement );

		}

		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );
		container.dom.appendChild( renderer.domElement );

		camera = editor.camera.clone();

		scene = new THREE.ObjectLoader().parse( json );

		//

		scripts = [];

		scene.traverse( function ( child ) {

			if ( child.script !== undefined ) {

				var script = new Function( 'scene', child.script.source ).bind( child );
				scripts.push( script );

			}

		} );

	};

	var request;

	var play = function () {

		request = requestAnimationFrame( play );

		update();
		render();

	};

	var stop = function () {

		cancelAnimationFrame( request );

	};

	var render = function () {

		renderer.render( scene, camera );

	};

	var update = function () {

		for ( var i = 0; i < scripts.length; i ++ ) {

			scripts[ i ]( scene );

		}

		render();

	};

	signals.startPlayer.add( function ( json ) {

		container.setDisplay( '' );

		load( json );
		play();

	} );

	signals.stopPlayer.add( function () {

		container.setDisplay( 'none' );

		stop();

	} );

	return container;

};