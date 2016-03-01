function createWalls(){
	var fixDef = new b2FixtureDef;
	fixDef.density = 1.0;
	fixDef.friction = 0.5;
	fixDef.restitution = 0.2;

	var bodyDef = new b2BodyDef;

	//create ground
	bodyDef.type = b2Body.b2_staticBody;
	bodyDef.position.x = 9;
	bodyDef.position.y = 20;
	fixDef.shape = new b2PolygonShape;
	
	fixDef.shape.SetAsBox(32, 0.5);
	world.CreateBody(bodyDef).CreateFixture(fixDef);

	bodyDef.position.x = 0;
	bodyDef.position.y = 0;
	fixDef.shape.SetAsBox(0.5, 20);
	world.CreateBody(bodyDef).CreateFixture(fixDef);

	bodyDef.position.x = 40;
	bodyDef.position.y = 0;
	fixDef.shape.SetAsBox(0.5, 20);
	world.CreateBody(bodyDef).CreateFixture(fixDef);


}

function setup() {
	createCanvas(1200, 800);
	world = new b2World(
			new b2Vec2(0, 10)    //gravity
			,  true                 //allow sleep
			);

	createWalls();	

	//create some objects
	
	balls.push(new Ball(new b2Vec2(10, 3), 2));

	var listener = new Box2D.Dynamics.b2ContactListener;
	listener.BeginContact = function(contact) {
		var objA = contact.GetFixtureA().GetBody().GetUserData();
		var objB = contact.GetFixtureB().GetBody().GetUserData();
		var stick;
		var ball;
		if(objB instanceof Stick){
			stick = objB;
		} else if(objA instanceof Stick) {
			stick = objA;
		}

		if(objB instanceof Ball){
			ball = objB;
		} else if(objA instanceof Ball) {
			ball = objA;
		}
		if(stick && ball && !stick.remove)
			ball.die();

		if(stick)
			stick.remove = true;



	}
	this.world.SetContactListener(listener);

	//setup debug draw
	var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(document.getElementById("defaultCanvas0").getContext("2d"));
	debugDraw.SetDrawScale(30.0);
	debugDraw.SetFillAlpha(0.3);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	world.SetDebugDraw(debugDraw);

}

function preload() {
	ballImg = loadImage('roux.png');
}

function keyPressed() {
	var vec;
	switch (keyCode){
		case LEFT_ARROW:
			vec = (new b2Vec2(-1, 0));
		break;
		case RIGHT_ARROW:
			vec = (new b2Vec2(1, 0));
		break;
		case UP_ARROW:
			vec = (new b2Vec2(0, -1));
		break;
		case DOWN_ARROW:
			vec = (new b2Vec2(0, 1));
		break;
	}
	if(vec){
		for(var i = 0; i < balls.length; i++){
			var p = balls[i];
			p.move(vec);
		}

	}
}

function rain() {
	if(lastRain > currentRain){
		sticks.push(new Stick(new b2Vec2(Math.random()*40, -10)));
		lastRain = 0;
		currentRain -= currentRain > minRain ? 1 : 0;
	}
	lastRain++;
}


function update() {
	//Use the rain system
	rain();

	//Delete all bodies
	for(var i = 0; i < destroy_bodies.length; i++)	
		world.DestroyBody(destroy_bodies[i]);
	destroy_bodies.length = 0;
	
	//Create bodies
	for(var i = 0; i < balls.length; i++){
		var p = balls[i];
		if(!p.body)
			p.createBody();
	}
	
	//Update sticks
	for(var i = 0; i < sticks.length; i++){
		sticks[i].update();
	}
	//Step physic world
	world.Step(
			1 / 60   //frame-rate
			,  10       //velocity iterations
			,  10       //position iterations
		  );	
	//Clear world forces
	world.ClearForces();

}

function draw() {
	
	update();

	//Clear background
	background(255);
	world.DrawDebugData();
	
	//Draw balls
	for(var i = 0; i < balls.length; i++)
		balls[i].draw();

	//Draw sticks
	for(var i = 0; i < sticks.length; i++)
		sticks[i].draw();
	
	//Draw end game message
	if(balls.length == 0){
		textSize(32);
		fill(255, 0, 0);
		text(phrases[idPhrase], 10, 60);
	}

}
