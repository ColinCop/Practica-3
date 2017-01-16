'use strict';

//TODO 1.1 Require de las escenas, play_scene, gameover_scene y menu_scene.

//  The Google WebFont Loader will look for this object, so create it before loading the script.
var gameOver = require ('./gameover_scene.js');
var playScene = require ('./play_scene.js');
var menuScene = require ('./menu_scene.js');
var ggScene = require ('./gg_scene.js');



var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');

    this.game.load.spritesheet('button', 'images/buttons.png', 168, 70);
     this.game.load.image('ss','images/savesanta.png');
    this.game.load.image('logo', 'images/phaser.png');
  },

  create: function () {
    //this.game.state.start('preloader');
      this.game.state.start('menu');
   
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(100,300, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5); 
    this.game.load.setPreloadSprite(this.loadingBar);
    this.game.stage.backgroundColor = "#000000";
    
    
    
    this.load.onLoadStart.add(this.loadStart, this);
    //TODO 2.1 Cargar el tilemap images/map.json con el nombre de la cache 'tilemap'.
      //la imagen 'images/simples_pimples.png' con el nombre de la cache 'tiles' y
      // el atlasJSONHash con 'images/rush_spritesheet.png' como imagen y 'images/rush_spritesheet.json'
      //como descriptor de la animación.
      this.game.load.tilemap('tilemap','images/mapa.json', null, Phaser.Tilemap.TILED_JSON);
      this.game.load.image('tiles', 'images/simples_pimples.png');
      this.game.load.image('roca', 'images/roca.png');
      this.game.load.image('chimeneas', 'images/chimenea.png');
      this.game.load.image('madera', 'images/madera.png');
      this.game.load.image('ladrillos', 'images/casa.jpeg');
      this.game.load.image('bb','images/baby.jpg');
      this.game.load.image('fondo','images/fond.png');
      this.game.load.image('happy','images/happy.jpg');
     this.game.load.image('trineo','images/trineo.png');
      this.game.load.image('regalo','images/Present_sprite.png');
      this.game.load.image('enemigo','images/caparazon.png');
      this.game.load.image('rush','images/santa.png');
      this.game.load.image('elfo','images/elfito.png');
      this.game.load.image('martillo','images/martillo.png');
      //this.game.load.atlas('rush', 'images/rush_spritesheet.png', 'images/rush_spritesheet.json' ,Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
      //TODO 2.2a Escuchar el evento onLoadComplete con el mismo método loadComplete que el state 'play'
      this.load.onLoadComplete.add(this.loadComplete, this);

    
  },

  loadStart: function () {
    console.log("Game Assets Loading ...");
  },
    
      //TODO 2.2b function loadComplete()
  loadComplete: function() {
  //  text.setText("Load Complete");  
    this.game.state.start('play')
    //this.ready = true;
  },
   

    update: function(){
        this._loadingBar
    }
};


var wfconfig = {
 
    active: function() { 
        console.log("font loaded");
        init();
    },
 
    google: {
        families: ['Sniglet']
    }

};
//TODO 3.2 Cargar Google font cuando la página esté cargada con wfconfig.
 window.onload = function(){
      WebFont.load(wfconfig);
      
    };
 

//TODO 3.3 La creación del juego y la asignación de los states se hará en el método init().

function init () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

//TODO 1.2 Añadir los states 'boot' BootScene, 'menu' MenuScene, 'preloader' PreloaderScene, 'play' PlayScene, 'gameOver' GameOver.
game.state.add('boot', BootScene);
game.state.add('menu', menuScene);
game.state.add('preloader', PreloaderScene);
game.state.add('play', playScene);
game.state.add('gameOver', gameOver);
game.state.add('gg', ggScene);
//TODO 1.3 iniciar el state 'boot'. 
game.state.start('boot');
    
};
