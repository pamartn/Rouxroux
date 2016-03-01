var Stick = function(position){
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

Stick.prototype.getPosition = function(){
	return this.body.GetPosition();
}

Stick.prototype.update = function(){
	if(this.remove){
		if(this.time > 500)
			this.die();
		else
			this.time++;
	}
}

Stick.prototype.draw = function(){
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

Stick.prototype.die = function() {
	var index = sticks.indexOf(this);
	sticks.splice(index, 1);
	destroy_bodies.push(this.body);
}

