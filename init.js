var world;
var balls = [];
var sticks = [];
var ballImg;
var lastRain = 0;
var destroy_bodies = [];
var phrases = ["Tu as perdu ton ame !", "Aaahh .. mettre des batons dans les roux !", "Roux roux ... rouuux"];
var idPhrase = Math.floor(Math.random() * phrases.length);
var minRain = 20;
var currentRain = 60;
var score = 0;
var backgroundImg;


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

