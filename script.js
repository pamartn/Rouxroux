var world;
var particules = [];
var batons = [];
var img;
var lastRain = 0;
var destroy_bodies = [];
var phrases = ["Tu as perdu ton ame !", "Aaahh .. mettre des batons dans les roux !", "Roux roux ... rouuux"];
var idPhrase = Math.floor(Math.random() * phrases.length);
var minRain = 20;
var currentRain = 60;

var   b2Vec2 = Box2D.Common.Math.b2Vec2
,	b2BodyDef = Box2D.Dynamics.b2BodyDef
,	b2Body = Box2D.Dynamics.b2Body
,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
,	b2Fixture = Box2D.Dynamics.b2Fixture
,	b2World = Box2D.Dynamics.b2World
,	b2MassData = Box2D.Collision.Shapes.b2MassData
,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
;

var Baton = function(position){
	var fixDef = new b2FixtureDef;
	fixDef.density     = 1.0;
	fixDef.friction    = 0.5;
	fixDef.restitution = 0.2;

	this.largeur  =  0.3; //radius
	this.longueur = Math.random()*3+2;
	this.remove   = false;
	this.time     = 0;
	//create  shape
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(
			this.largeur/2 //half width
			,  this.longueur/2 //half height
			);
	
	
	var bodyDef  = new b2BodyDef;
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.x = position.x;
	bodyDef.position.y = position.y;

	this.body = world.CreateBody(bodyDef).CreateFixture(fixDef).m_body;
	this.body.SetUserData(this);
}

Baton.prototype.getPosition = function(){
	return this.body.GetPosition();
}

Baton.prototype.update = function(){
	if(this.remove){
		if(this.time > 500)
			this.die();
		else
			this.time++;
	}
}

Baton.prototype.draw = function(){
	var angle = this.body.GetAngle();
	translate(this.getPosition().x*30, this.getPosition().y*30);
	rotate(angle);
	fill(127);

	rect(-this.largeur*15, -this.longueur*15, this.largeur*30, this.longueur*30);	
	fill(255, 0, 0);
	

	rotate(-angle);
	translate(-this.getPosition().x*30, -this.getPosition().y*30);
	if(this.getPosition().y < 0)
		rect(this.getPosition().x*30, 0, 30, 30);
}

Baton.prototype.die = function() {
	var index = batons.indexOf(this);
	batons.splice(index, 1);
	destroy_bodies.push(this.body);
}

var Particule = function(position, radius){
	this.speed = 5;
	this.jumpSpeed = 10;
	this.radius = radius; //radius
	this.position = position;
	if(!world.IsLocked())
		this.createBody();
}


Particule.prototype.createBody = function(){
	var fixDef = new b2FixtureDef;
	fixDef.density = 1.0;
	fixDef.friction = 0.5;
	fixDef.restitution = 0.8;
	fixDef.shape = new b2CircleShape(this.radius);
	var bodyDef = new b2BodyDef;

	//create ground
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.x = this.position.x;
	bodyDef.position.y = this.position.y;
	
	this.body = world.CreateBody(bodyDef).CreateFixture(fixDef).m_body;
	this.body.SetUserData(this);
}

Particule.prototype.getPosition = function(){
	return this.body.GetPosition();
}

Particule.prototype.draw = function(){
	if(this.body){
		var angle = this.body.GetAngle();
		translate(this.getPosition().x*30, this.getPosition().y*30);
		rotate(angle);
		image(img, -this.radius*30, -this.radius*30, this.radius*2*30, this.radius*2*30);
		rotate(-angle);
		translate(-this.getPosition().x*30, -this.getPosition().y*30);
	}
}


Particule.prototype.move = function(dir){
	this.body.SetLinearVelocity(new b2Vec2(dir.x*this.speed, dir.y*this.jumpSpeed));
}

Particule.prototype.die = function(){
	
	var index = particules.indexOf(this);
	particules.splice(index, 1);
	destroy_bodies.push(this.body);

	if(this.radius > 0.6){
		for(var i = 0; i < 2; i++)	
			particules.push(new Particule(this.getPosition(), this.radius/1.5));
	}
}

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
	
	particules.push(new Particule(new b2Vec2(10, 3), 2));

	var listener = new Box2D.Dynamics.b2ContactListener;
	listener.BeginContact = function(contact) {
		var objA = contact.GetFixtureA().GetBody().GetUserData();
		var objB = contact.GetFixtureB().GetBody().GetUserData();
		var baton;
		var rouxroux;
		if(objB instanceof Baton){
			baton = objB;
		} else if(objA instanceof Baton) {
			baton = objA;
		}

		if(objB instanceof Particule){
			rouxroux = objB;
		} else if(objA instanceof Particule) {
			rouxroux = objA;
		}
		if(baton && rouxroux && !baton.remove)
			rouxroux.die();

		if(baton)
			baton.remove = true;



	}
	listener.EndContact = function(contact) {
		// console.log(contact.GetFixtureA().GetBody().GetUserData());
	}
	listener.PostSolve = function(contact, impulse) {

	}
	listener.PreSolve = function(contact, oldManifold) {

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
	img = loadImage('roux.png');
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
		for(var i = 0; i < particules.length; i++){
			var p = particules[i];
			p.move(vec);
		}

	}
}

function rain() {
	if(lastRain > currentRain){
		batons.push(new Baton(new b2Vec2(Math.random()*40, -10)));
		lastRain = 0;
		currentRain -= currentRain > minRain ? 1 : 0;
	}
	lastRain++;
}


function update() {
	rain();

	//delete
	for(var i = 0; i < destroy_bodies.length; i++)	
		world.DestroyBody(destroy_bodies[i]);
	destroy_bodies.length = 0;
	for(var i = 0; i < particules.length; i++){
		var p = particules[i];
		if(!p.body)
			p.createBody();
	}

	for(var i = 0; i < batons.length; i++){
		batons[i].update();
	}
	world.Step(
			1 / 60   //frame-rate
			,  10       //velocity iterations
			,  10       //position iterations
		  );
}

function draw() {
	
	update();

	background(255);
	world.DrawDebugData();
	fill(0);
	for(var i = 0; i < particules.length; i++){
		var p = particules[i];
		p.draw();
	}
	for(var i = 0; i < batons.length; i++){
		var p = batons[i];
		p.draw();
	}
	world.ClearForces();
	if(particules.length == 0){
		textSize(32);
		fill(255, 0, 0);
		text(phrases[idPhrase], 10, 60);
	}

}
