var Ball = function(position, radius){
	this.speed = 5;
	this.jumpSpeed = 10;
	this.radius = radius; //radius
	this.position = position;
	if(!world.IsLocked())
		this.createBody();
}


Ball.prototype.createBody = function(){
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

Ball.prototype.getPosition = function(){
	return this.body.GetPosition();
}

Ball.prototype.draw = function(){
	if(this.body){
		var angle = this.body.GetAngle();
		translate(this.getPosition().x*30, this.getPosition().y*30);
		rotate(angle);
		image(ballImg, -this.radius*30, -this.radius*30, this.radius*2*30, this.radius*2*30);
		if(this.message_time > 0){
			textSize(20);
			fill('red');
			text(this.message, this.radius*30 + 20, this.radius*30 - 20);
			this.message_time--;
		}
		rotate(-angle);
		translate(-this.getPosition().x*30, -this.getPosition().y*30);
	}
}


Ball.prototype.move = function(dir){
	this.body.SetLinearVelocity(new b2Vec2(dir.x*this.speed, dir.y*this.jumpSpeed));
}

Ball.prototype.die = function(){
	
	var index = balls.indexOf(this);
	balls.splice(index, 1);
	destroy_bodies.push(this.body);
	
	if(this.radius > 0.6){
		for(var i = 0; i < 2; i++){
			var b = new Ball(this.getPosition(), this.radius/1.5);
			b.message = "Outch";
			b.message_time = 100;
			balls.push(b);
		}
	}
}

