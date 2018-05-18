
var upgradeList={};
var bulletList={};
var player;
var enemyList={};

Entity = function(type,id,x,y,width,height,img){
	var self = {
	     	type:type,
	     	x:x,
	     	y:y,
	     	id:id,
	     	width:width,
	     	height:height,
	     	img:img,
	     };

	     self.update = function(){
	     	self.updatePosition();
	            self.draw();
	        }
 	    self.draw = function(){
        	ctx.save();
            var x = self.x-player.x;
            var y = self.y-player.y;
            x += WIDTH/2;
            y += HEIGHT/2;

            x -= self.width/2;
            y -= self.height/2;
        	ctx.drawImage(self.img,
                0,0,self.img.width,self.img.height,
                x,y,self.width,self.height);        	
        	
            ctx.restore();

            }
        self.updatePosition = function(){}
        self.getDistanceBetween = function(entity2){//return dsitance
         	var vx = self.x - entity2.x;
         	var vy = self.y - entity2.y;
         	return Math.sqrt(vx*vx + vy*vy);
         }
		self.testCollision = function (entity2){       //return if colliding (true/false)
		        var rect1 = {
		                x:self.x-self.width/2,
		                y:self.y-self.height/2,
		                width:self.width,
		                height:self.height,
		        }
		        var rect2 = {
		                x:entity2.x-entity2.width/2,
		                y:entity2.y-entity2.height/2,
		                width:entity2.width,
		                height:entity2.height,
		        }
		return testCollisionRectRect(rect1,rect2);
		  
		}
 
		return self;
        } 
    
Player= function(){
    var self = Actor('player','myId',50,40,50,70,Img.player,10,1);
        var super_update = self.update;
        self.maxSpeed = 10;
        self.update = function(){
            super_update();
            if(self.pressingRight||self.pressingLeft||self.pressingUp||self.pressingDown)
                self.spriteAnimCounter += 0.2;
            if(self.pressingMouseLeft)
                self.performAttack();
            if(self.pressingMouseRight)
                self.performSpecialAttack();
        }

        
        self.onDeath = function(){
             var timeSurived = Date.now() - timeWhenGameStarted;
                            console.log('you lost! you surived for' +timeSurived+'ms.');
                            startNewGame();
        }
     	self.hp = 12;
     	
        self.pressingMouseLeft=false;
        self.pressingMouseRight=false;
     	   
     return self;
     }

Actor = function(type,id,x,y,width,height,img,hp,atkspd){
    var self = Entity(type,id,x,y,width,height,img);
 	    self.hp=hp;
        self.hpMax=hp;
     	self.atkspd=atkspd;
     	self.atkCounter=0;
     	self.aimAngle=0; 
        self.maxSpeed = 3;
        self.pressingLeft=false;
        self.pressingUp=false;
        self.pressingDown=false;
        self.pressingRight=false;

    
	    self.performAttack = function(){
			 if(self.atkCounter>10){
			     	randomlyGenerateBullet(self);
			     	self.atkCounter = 0;
			     }
	    }
        self.spriteAnimCounter = 0;
        self.updatePosition = function(){
                var oldX= self.x;
                var oldY= self.y;

                var bumperRightPos = {x:self.x + 40,y:self.y};
                var bumperLeftPos = {x:self.x - 40,y:self.y};
                var bumperUpPos = {x:self.x,y:self.y-16};
                var bumperDownPos = {x:self.x,y:self.y+64};
                var rightBumperTouchesWall = Maps.current.isPositionWall(bumperRightPos);
                if(Maps.current.isPositionWall(bumperRightPos)){
                    self.x -=5;
                }else{
                     if(self.pressingRight)
                    self.x += self.maxSpeed;
                }
                if(Maps.current.isPositionWall(bumperLeftPos)){
                    self.x +=5;
                }else{
                   if(self.pressingLeft)
                    self.x -= self.maxSpeed;
                } if(Maps.current.isPositionWall(bumperDownPos)){
                    self.y -=5;
                }else{                   
                  if(self.pressingDown)
                      self.y += self.maxSpeed;
                } if(Maps.current.isPositionWall(bumperUpPos)){
                    self.y +=5;
                }else{
                   if(self.pressingUp)
                    self.y -= self.maxSpeed;
                }
               
                
                
                
                //isPositionValid
                if(self.x<self.width/2){
                        self.x = self.width/2;
                    }
                    if(self.x >Maps.current.width - self.width/2){
                        self.x= Maps.current.width - self.width/2;
                    }
                    if(self.y<self.height/2){
                        self.y = self.height/2;
                    }
                    if(self.y > Maps.current.height - self.height/2){
                        self.y= Maps.current.height - self.height/2;
                        }
                    if(Maps.current.isPositionWall(self)){
                        self.x = oldX;
                        self.y = oldY;
                    }
                        
                }
        self.draw = function(){
            ctx.save();
            var x = self.x-player.x;
            var y = self.y-player.y;
            x += WIDTH/2;
            y += HEIGHT/2;

            x -= self.width/2;
            y -= self.height/2;

            var directionMod = 3;
            var aimAngle = self.aimAngle;
            if(aimAngle < 0)
                aimAngle = 360+ aimAngle;
            if(aimAngle>= 45 && aimAngle<135)
                directionMod=2;
            if(aimAngle>= 135 && aimAngle<225)
                directionMod=1;
            if(aimAngle>= 225 && aimAngle<315)
                directionMod=0;

            var walkingMod = Math.floor(self.spriteAnimCounter) % 3;
           ;

            var frameWidth = self.img.width/3;
            var frameHeight =self.img.height/4;
            ctx.drawImage(self.img,
                walkingMod*frameWidth,directionMod*frameHeight,frameWidth,frameHeight,
                x,y,self.width,self.height);            
            
            ctx.restore();

            }
	    self.performSpecialAttack = function(){
	    	if(self.atkCounter>50){
	     	/*for(var angle = 0; angle<360;angle++){
	        randomlyGenerateBullet(player,angle);
	     	}*/
	     	 randomlyGenerateBullet(self,self.aimAngle - 5);
		     randomlyGenerateBullet(self,self.aimAngle);
		     randomlyGenerateBullet(self,self.aimAngle + 5);
	     self.atkCounter = 0;
     }
    }
	var super_update = self.update;
	    self.update = function(){
	    	    super_update();
                if(self.hp<=0){
                    self.onDeath();
                }
	        self.atkCounter += self.atkspd;
	
        }
        self.onDeath = function(){};
	    return self;
     }


Enemy = function(id,x,y,width,height,img,hp,atkspd){
	var self = Actor('enemy',id,x,y,width,height,img,hp,atkspd);
        enemyList[id] = self;
        self.toRemove= false;
        var super_update = self.update;
        self.update = function(){
            super_update();
            self.updateAim();
            self.updateKeyPress();
            self.spriteAnimCounter += 0.2;
        }
        var super_draw= self.draw;
        self.draw = function(){
            super_draw();
            var x = self.x-player.x + WIDTH/2;
            var y = self.y-player.y + HEIGHT/2 - self.height/2 - 20;
            ctx.save();
            ctx.fillStyle = 'red';
            var width = 100*self.hp/self.hpMax;
            if(width<0)
                width = 0;
            ctx.fillRect(x-50,y,width,10);
            ctx.strokeStyle = 'black';
            ctx.strokeRect(x-50,y,100,10);
            ctx.restore();
        }

        self.updateAim = function(){
            var diffX = player.x-self.x;
            var diffY = player.y - self.y;
            self.aimAngle = Math.atan2(diffY,diffX)/Math.PI * 180;

        }


        self.updateKeyPress = function(){
            var diffX = player.x-self.x;
            var diffY = player.y - self.y;
            self.pressingLeft=diffX <-3;
            self.pressingUp=diffY<-3;
            self.pressingDown=diffY>3;
            self.pressingRight=diffX>3;


        }
        self.onDeath = function(){
            self.toRemove = true;
        }
        
     }
Enemy.update = function(){
        if(frameCount%100 === 0){
            randomlyGenerateEnemy();
        }
        for(var key in enemyList){
            enemyList[key].update();
            enemyList[key].performAttack();
            /*var iscolliding = player.testCollision(enemyList[key]);
            if(iscolliding){
                player.hp = player.hp - 1;               
            }*/
        }
        for(var key in enemyList){
            if(enemyList[key].toRemove){
                delete enemyList[key];
            }
        }
     }

Upgrade = function(id,x,y,width,height,category,img){
 	var self = Entity('upgrade',id,x,y,width,height,img);
     	self.category=category;        
        upgradeList[id] = self;
     }

     Upgrade.update = function(){
         if(frameCount%80 === 0){
            randomlyGenerateUpgrade();
        }
        for(var up in upgradeList){
            upgradeList[up].update();
            var iscolliding = player.testCollision(upgradeList[up]);
            if(iscolliding){
                if(upgradeList[up].category === 'score'){
                    score += 1000;
                }else if(upgradeList[up].category === 'atkspd'){
                    player.atkspd +=3;
                }               
                delete upgradeList[up];               
            }
        }
     }
randomlyGenerateUpgrade = function(){
        //Math.random() returns a number between 0 and 1
        var x = Math.random()*  Maps.current.width;
        var y = Math.random()*  Maps.current.height;
        var height = 24;     //between 10 and 40
        var width = 24;
        var id = Math.random();
        if(Math.random()<0.5){
        	var category = 'score';
        	var img = Img.upgrade1;
        }else{
        	var category = 'atkspd';
        	var img = Img.upgrade2;
        }
        Upgrade(id,x,y,width,height,category,img);
     }

Bullet = function(id,x,y,spdX,spdY,width,height,combatType){
    var self = Entity('bullet',id,x,y,width,height,Img.bullet);
        self.timer=0;   
        self.combatType = combatType;
        self.spdx=spdX;
        self.spdy=spdY;  
        self.toRemove = false;
        
        var super_update = self.update;
        self.update = function(){
            super_update();
            self.timer++;
            if(self.timer>75){
                self.toRemove= true;
            }
            if(self.combatType === 'player'){
                for(key2 in enemyList){
                if(self.testCollision(enemyList[key2])){
                    self.toRemove = true;
                    enemyList[key2].hp -= 1;
                }
            }   
            }else if(self.combatType === 'enemy'){
                 if(self.testCollision(player)){
                    self.toRemove = true;
                    player.hp = player.hp - 1;   
                }
            }

            if(Maps.current.isPositionWall(self)){
                self.toRemove = true;
            }

        }

        self.updatePosition = function(){             
            self.x += self.spdx;
            self.y += self.spdy;
            //ctx.fillText(entity.name,entity.x,entity.y);
            
            if(self.x<0 || self.x>Maps.current.width){
               self.spdx = -self.spdx;
                }
            if(self.y<0 || self.y>Maps.current.height){   
                self.spdy = -self.spdy;
                }            
        }
        bulletList[id] = self;
     }
Bullet.update = function(){
      for(var key in bulletList){
        var b =bulletList[key];
        b.update();         
        
        if(b.toRemove){
            delete bulletList[key];
        }       
        }
     }
randomlyGenerateBullet= function(actor,overwriteAngle){
        //Math.random() returns a number between 0 and 1
        var x = actor.x;
        var y = actor.y;
        var height = 20;     //between 10 and 40
        var width = 20;
        var id = Math.random();
        var angle = actor.aimAngle;
        if(overwriteAngle !== undefined){
            angle = overwriteAngle;
        }
        var spdX = Math.cos(angle/180*Math.PI)*5;
        var spdY =Math.sin(angle/180*Math.PI)*5;
        Bullet(id,x,y,spdX,spdY,width,height,actor.type);
     }
    
    /*testCollision = function(entity1,entity2){//true or false
         var rect1 = {
                    x:entity1.x-entity1.width/2,
                    y:entity1.y-entity1.height/2,
                    width: entity1.width,
                    height:entity1.height,
         }
          var rect2 = {
                     x:entity2.x-entity2.width/2,
                    
                     y:entity2.y-entity2.height/2,
                    
                     width:entity2.width,
                    
                     height:entity2.height,
         }
         return testCollisionRectRect(rect1,rect2);
     }*/

randomlyGenerateEnemy = function(){
        //Math.random() returns a number between 0 and 1
        var x = Math.random()* Maps.current.width;
        var y = Math.random()* Maps.current.height;
        var height = 64;     //between 10 and 40
        var width = 64;
        var id = Math.random();
        if(Math.random()<0.5){Enemy(id,x,y,width,height,Img.enemy,10,1);
          }else{
         Enemy(id,x,y,width,height,Img.bee,10,3);
         }
     }