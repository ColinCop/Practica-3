'use strict';

//Enumerados: PlayerState son los estado por los que pasa el player. Directions son las direcciones a las que se puede
//mover el player.
var PlayerState = {'JUMP':0, 'RUN':1, 'FALLING':2, 'STOP':3}
var EnemyState = {'JUMP':0, 'RUN':1, 'FALLING':2, 'STOP':3}
var Direction = {'LEFT':0, 'RIGHT':1, 'NONE':3}

 var regalitos;
 var puntos = 0;
 var scoreText;
//Scena de juego.
var PlayScene = {
    _rush: {}, //player
    _speed: 500, //velocidad del player
    _jumpSpeed: 800, //velocidad de salto
    _jumpHight: 250, //altura máxima del salto.
    _playerState: PlayerState.STOP, //estado del player
    _direction: Direction.NONE,  //dirección inicial del player. NONE es ninguna dirección.

    _enemyrush: {}, //player
    _enemyspeed: 300, //velocidad del player
    _enemyjumpSpeed: 600, //velocidad de salto
    _enemyjumpHight: 150, //altura máxima del salto.
    _EnemyState: PlayerState.STOP, //estado del player
    _enemydirection: Direction.NONE,  //dirección inicial del player. NONE es ninguna dirección.


    //Método constructor...
  create: function () {
  	regalitos = this.game.add.group();
  	scoreText = this.game.add.text(16, 1000, 'score: 0', { fontSize: '32px', fill: '#000' });

  
      //Creamos al player con un sprite por defecto.
     // regalos = game.add.group();
      //TODO 5 Creamos a rush 'rush'  con el sprite por defecto en el 10, 10 con la animación por defecto 'rush_idle01'
      this._rush = this.game.add.sprite(10,900,'rush');
      this._enemyrush = this.game.add.sprite(300,200,'enemigo');
     this._enemyrush.scale.setTo(0.08,0.08);
     //this._rush.scale.setTo(2.3,2.3);
    
      //TODO 4: Cargar el tilemap 'tilemap' y asignarle al tileset 'patrones' la imagen de sprites 'tiles'
      this.map = this.game.add.tilemap('tilemap');
    //  this.map.addTilesetImage('patrones','tiles');
      this.map.addTilesetImage('kek','madera');
      this.map.addTilesetImage('casa','ladrillos');
      this.map.addTilesetImage('Tileset','chimeneas');
      this.map.addTilesetImage('roca','roca');




      //Creacion de las layers
    this.backgroundLayer = this.map.createLayer('BackGroundLayer');
     this.groundLayer2 = this.map.createLayer('GroundLayer2');
      this.groundLayer = this.map.createLayer('GroundLayer');
      this.chimeneasLayer = this.map.createLayer('Chimeneas');
     
      //plano de muerte
      this.death = this.map.createLayer('Death');
      //Colisiones con el plano de muerte y con el plano de muerte y con suelo.
      this.map.setCollisionBetween(1, 5000, true, 'Death');
      this.map.setCollisionBetween(1, 5000, true, 'Chimeneas');
      this.map.setCollisionBetween(1, 5000, true, 'GroundLayer');
      this.map.setCollisionBetween(1, 5000, true, 'GroundLayer2');
      //this.death.visible = false;
      //Cambia la escala a x3.
      this.groundLayer.setScale(1,1);
      this.backgroundLayer.setScale(1,1);
      this.death.setScale(1,1);
      
      //this.groundLayer.resizeWorld(); //resize world and adjust to the screen
      
      //nombre de la animación, frames, framerate, isloop
     /* this._rush.animations.add('run',
                    Phaser.Animation.generateFrameNames('rush_run',1,5,'',2),10,true);
      this._rush.animations.add('stop',
                    Phaser.Animation.generateFrameNames('rush_idle',1,1,'',2),0,false);
      this._rush.animations.add('jump',
                     Phaser.Animation.generateFrameNames('rush_jump',2,2,'',2),0,false);
                     */
    var key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    key1.onDown.add(DropPresent, this);

     var key2 = this.game.input.keyboard.addKey(Phaser.Keyboard.ESCAPE);
    key2.onDown.add(Pause, this);

      this.configure();
      this.groundLayer.resizeWorld();
     // debug.log(this.groundLayer.scale());
      this.death.resizeWorld();
      this.groundLayer2.resizeWorld();

  },
    
    //IS called one per frame.
    update: function () {
        var moveDirection = new Phaser.Point(0, 0);
        var collisionWithTilemap = this.game.physics.arcade.collide(this._rush, this.groundLayer);
        var collisionWithTilemap1 =this.game.physics.arcade.collide(this._rush, this.groundLayer2);
         var collisionWithTilemap2 =this.game.physics.arcade.collide(this._rush, this.chimeneasLayer);
        this.game.physics.arcade.collide(this._enemyrush, this.groundLayer);
        this.game.physics.arcade.collide(regalitos, this.groundLayer);
         
        
		this.game.physics.arcade.collide(this.death,regalitos,perderRegalo,null,this);
		this.game.physics.arcade.collide(this.chimeneasLayer,regalitos,newPremio,null,this);

        var movement = this.GetMovement();
      
       this._enemyrush.body.velocity.x = -50;
       scoreText.x = this._rush.x -380;
       scoreText.y = this._rush.y -300;

        //transitions
        switch(this._playerState)
        {
            case PlayerState.STOP:
            case PlayerState.RUN:
                if(this.isJumping(collisionWithTilemap,collisionWithTilemap1,collisionWithTilemap2)){
                    this._playerState = PlayerState.JUMP;
                    this._initialJumpHeight = this._rush.y;
                    this._rush.animations.play('jump');
                }
                else{
                    if(movement !== Direction.NONE){
                        this._playerState = PlayerState.RUN;
                        this._rush.animations.play('run');
                    }
                    else{
                        this._playerState = PlayerState.STOP;
                        this._rush.animations.play('stop');
                    }
                }    
                break;
                
            case PlayerState.JUMP:
                
                var currentJumpHeight = this._rush.y - this._initialJumpHeight;
                this._playerState = (currentJumpHeight*currentJumpHeight < this._jumpHight*this._jumpHight)
                    ? PlayerState.JUMP : PlayerState.FALLING;
                break;
                
            case PlayerState.FALLING:
                if(this.isStanding()){
                    if(movement !== Direction.NONE){
                        this._playerState = PlayerState.RUN;
                        this._rush.animations.play('run');
                    }
                    else{
                        this._playerState = PlayerState.STOP;
                        this._rush.animations.play('stop');
                    }
                }
                break;     
        }
        //States
        switch(this._playerState){
                
            case PlayerState.STOP:
                moveDirection.x = 0;
                break;
            case PlayerState.JUMP:
            case PlayerState.RUN:
            case PlayerState.FALLING:
                if(movement === Direction.RIGHT){
                    moveDirection.x = this._speed;
                    if(this._rush.scale.x < 0)
                        this._rush.scale.x *= -1;
                }
                else if (movement === Direction.LEFT){
                    moveDirection.x = -this._speed;
                    if(this._rush.scale.x > 0)
                        this._rush.scale.x *= -1; 
                }
                else {
                	moveDirection.x = 0;
                }
                if(this._playerState === PlayerState.JUMP)
                    moveDirection.y = -this._jumpSpeed;
                if(this._playerState === PlayerState.FALLING)
                    moveDirection.y = 0;
                break;    
        }
        //movement
        this.movement(moveDirection,5,
                      this.backgroundLayer.layer.widthInPixels*this.backgroundLayer.scale.x - 10);
        this.checkPlayerFell();
    },
    
    
    canJump: function(collisionWithTilemap,collisionWithTilemap1,collisionWithTilemap2){
        return this.isStanding() && (collisionWithTilemap ||collisionWithTilemap1 ||
        collisionWithTilemap2);
    },
    
    onPlayerFell: function(){
        //TODO 6 Carga de 'gameOver';
        this.game.state.start('gameOver');
    },
    
    checkPlayerFell: function(){
        if(this.game.physics.arcade.collide(this._rush, this.death) || this.game.physics.arcade.collide(this._rush, this._enemyrush) )
            this.onPlayerFell();
        else if(this.game.physics.arcade.collide(this._enemyrush, this.death))
        	this._enemyrush.destroy();
        
      
    },

    isStanding: function(){
        return this._rush.body.blocked.down || this._rush.body.touching.down
    },
        
    isJumping: function(collisionWithTilemap,collisionWithTilemap1,collisionWithTilemap2){
        return this.canJump(collisionWithTilemap,collisionWithTilemap1,collisionWithTilemap2) && 
            this.game.input.keyboard.isDown(Phaser.Keyboard.UP);
    },
        
    GetMovement: function(){
        var movement = Direction.NONE
        //Move Right
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            movement = Direction.RIGHT;
        }
        //Move Left
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            movement = Direction.LEFT;
        }
        return movement;
    },
  
    //configure the scene
    configure: function(){
        //Start the Arcade Physics systems
        this.game.world.setBounds(0, 0, 2400, 160);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#c9f0ff';
        this.game.physics.arcade.enable(this._rush);
        this.game.physics.arcade.enable(this._enemyrush);
    
        
        this._rush.body.bounce.y = 1;
        this._rush.body.gravity.y = 20000;
        this._rush.body.gravity.x = 0;
        this._rush.body.velocity.x = 0;

        this._enemyrush.body.bounce.y = 0.2;
        this._enemyrush.body.gravity.y = 1000;
        this._enemyrush.body.gravity.x = 0;
        this._enemyrush.body.velocity.x = -50;
        this._enemyrush.body.drag.setTo(100,0);
        this.game.camera.follow(this._rush);
    },
    //move the player
    movement: function(point, xMin, xMax){
        this._rush.body.velocity = point;// * this.game.time.elapseTime;
        
        if((this._rush.x < xMin && point.x < 0)|| (this._rush.x > xMax && point.x > 0))
            this._rush.body.velocity.x = 0;

    },
    destroy: function(){
        
        this.tilemap.destroy();
        this.tiles.destroy();
       // this.game.world.setBounds(0,0,800,600);
       
    }
    //TODO 9 destruir los recursos tilemap, tiles y NO(logo).

};
  function DropPresent(){ 
    	
    	
    	  	var regali = regalitos.create(this._rush.x,this._rush.y,'regalo');    
    	  	regali.scale.setTo(2,2);
    	  	 this.game.physics.arcade.enable(regali);
   			 regali.body.gravity.y = 1000;
   			 regali.body.bounce.setTo(0.3,0.3);
   			 regali.body.velocity.x = this._rush.body.velocity.x/2;
   			 regali.body.drag.setTo(100,0);
   			setTimeout(function(){regali.destroy()},3000);
    

    	  
   
    }
    function perderRegalo(regalo){ 
    	regalo.kill();
    	  
    }
    function newPremio(regalo){
    	puntos++;
    	regalo.kill();
    	scoreText.text = 'Score = ' + puntos;
    }
    function Pause(){
    	this.game.paused = !this.game.paused;
    }

module.exports = PlayScene;
