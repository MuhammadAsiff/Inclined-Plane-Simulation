// This represents a block that travels along the same path
function Cuboid (height, width, positionX, positionY, velocityX, velocityY, accelerationX, accelerationY, frictionX, frictionY) 
{
	this.height = height;
	this.width = width;
	this.pX = positionX;
	this.pY = positionY;
	this.startpX=positionX;
	this.startpY=positionY;
	this.vX = velocityX;
	this.vY = velocityY;
	this.aX = accelerationX;
	this.aY = accelerationY;
	this.frictionX = frictionX;
	this.frictionY = frictionY;
	this.time=0.0;
	this.number=0;
	
	this.updateParameters=updateParameters;
	this.nextPosition=nextPosition;
	this.drawCuboid=drawCuboid;
}
// This is used for manual parameter setting, used in tests, left in case the application is extended
function updateParameters(positionX=this.pX, positionY=this.pY, velocityX=this.vX, velocityY=this.vY, accelerationX=this.aX, accelerationY=this.aY, height=this.height, width=this.width, frictionX=this.frictionX, frictionY=this.frictionY, time=this.time) 
{
	this.height = height;
	this.width = width;
	this.pX = positionX;
	this.pY = positionY;
	this.vX = velocityX;
	this.vY = velocityY;
	this.aX = accelerationX;
	this.aY = accelerationY;
	this.frictionX = frictionX;
	this.frictionY = frictionY;
}
// Calculates and updates the position of the block after the next time dt (selected by the user, or default 0.03s)
function nextPosition(dt)
{
	var frictionSign=null;
	this.number+=1;
	this.time=this.number*dt-0.0001;

	// Friction works the opposite of speed reversal
	if(this.vX>=0.0 && this.vY>=0.0)
	frictionSign=1.0;
	else if(this.vX<0.0 && this.vY<0.0)
	frictionSign=-1.0;

	//The acceleration due to friction must not exceed the acceleration of the block
	if(this.frictionX>this.aX)
	this.frictionX=this.aX;
	if(this.frictionY>this.aY)
	this.frictionY=this.aY;

//update of the position and speed of the block
	this.vX+=dt*(this.aX-frictionSign*this.frictionX);
	this.vY+=dt*(this.aY-frictionSign*this.frictionY);
	this.pX=this.startpX+((this.aX-frictionSign*this.frictionX)*this.time*this.time)/2.0;
	this.pY=this.startpY+((this.aY-frictionSign*this.frictionY)*this.time*this.time)/2.0;
}
// Draw the block
function drawCuboid(ctx,angle)
{
	ctx.fillStyle="#FF0000";
	ctx.beginPath();
	ctx.moveTo(this.pX,this.pY);

	var nextX=this.pX+Math.cos(angle*Math.PI/180.0)*this.width;
	var nextY=this.pY+Math.sin(angle*Math.PI/180.0)*this.width;
	ctx.lineTo(nextX, nextY);
	nextX=nextX+Math.sin(angle*Math.PI/180.0)*this.height;
	nextY=nextY-Math.cos(angle*Math.PI/180.0)*this.height;
	ctx.lineTo(nextX, nextY);
	nextX=nextX-Math.cos(angle*Math.PI/180.0)*this.width;
	nextY=nextY-Math.sin(angle*Math.PI/180.0)*this.width;
	ctx.lineTo(nextX, nextY);					
	ctx.lineTo(this.pX, this.pY);
	ctx.fill();
}
// This validates the information entered by the user and starts the block movement
function valid(lang)// thanks to the lang variable, the program recognizes the language of the page
{				
	if ((document.form1.length.value=="")||(document.form1.angle.value==""))
	{
		alert ("Any field can't be empty");
		return false;
	}
	else if ((parseFloat(document.form2.Length.value)>=parseFloat(document.form1.length.value))||(parseFloat(document.form1.length.value)>2000))
	{
		alert ("length value must be in (Cuboid length (default 10),2000] ");
		return false;
	}
	else if ((parseFloat(document.form1.angle.value)<=0)||(parseFloat(document.form1.angle.value)>90))
	{
		alert ("angle value must be in (0,90] ");
		return false;
	}
	else if ((parseFloat(document.form1.friction.value)<0))
	{
		alert ("friction value must be greater or equal than 0 ");
		return false;
	}
	else if ((parseFloat(document.form2.dt.value)<=0)||(parseFloat(document.form2.dt.value)>100))
	{
		alert ("angle value must be in (0,100] ");
		return false;
	}
	else if ((parseFloat(document.form2.Length.value)<=0)||(parseFloat(document.form2.Length.value)>=parseFloat(document.form1.length.value)))
	{
		alert ("Length value must be in (0,Plane Length) ");
		return false;
	}
	else if ((parseFloat(document.form2.Height.value)<0)||(parseFloat(document.form2.Height.value)>200))
	{
		alert ("Height value must be in (0,200] ");
		return false;
	}
	else 
	{
		runAndDraw(lang);
		return true;
	}
}
// The sound effects to be used
var bells = new Audio('bells.mp3'); 
var cheer = new Audio('cheer.mp3');
// a flag that says whether the block is running smoothly
var cuboidSlidingDown= false;

// This helps to control the number of running and uninstalling simulations. The minimum value is 0 (currently we are not displaying the simulation), the maximum value is 2 (We are displaying the simulations + we will ask a new simulation).
var numberOfTask=0;

var topX=0;
var topY=20;
function runAndDraw(lang)      
{
	if(numberOfTask<=1)
	{
		++numberOfTask;
		const canvasElem = document.getElementById('canvas');
		const ctx = canvasElem.getContext('2d');
		ctx.clearRect(0, 0, canvasElem.width, canvasElem.height);
		var length=parseFloat(document.form1.length.value);
		var angle=parseFloat(document.form1.angle.value);
		var friction=parseFloat(document.form1.friction.value);
		var dt=parseFloat(document.form2.dt.value);
		var rectLength=parseFloat(document.form2.Length.value);
		var rectHeight=parseFloat(document.form2.Height.value);
		var g =parseFloat(document.form3.g.value);
		var sina=Math.sin(angle*Math.PI/180.0);
		var cosa=Math.cos(angle*Math.PI/180.0);
		topY=rectHeight*cosa+20;
		canvasElem.height=length*sina+rectHeight*cosa+20;
		canvasElem.width=length*cosa+rectHeight*sina+20;
		var vX=0.0;
		var vY=0.0;

		var bottomX=topX+Math.cos(angle*Math.PI/180.0)*length;
		var bottomY=topY+Math.sin(angle*Math.PI/180.0)*length;

		var cuboid = new Cuboid(rectHeight,rectLength,topX,topY,vX,vY,g*sina*cosa,g*sina*sina,g*cosa*friction*cosa,g*cosa*friction*sina);
		cuboidSlidingDown=true;

		muteUnmute();
		bells.play();
		bells.addEventListener('ended', function() {
			if(cuboidSlidingDown)
			{
				this.currentTime = 0;
				this.play();
			}
		}
		, false);
		if(numberOfTask==1)
		{
			calcAndDrawNextPosition(bottomX,bottomY,angle,length,cuboid,ctx,canvasElem,dt,lang);
			var interval=setInterval(function() {
				calcAndDrawNextPosition(bottomX,bottomY,angle,length,cuboid,ctx,canvasElem,dt,lang);
				if(cuboid.pX >=bottomX- Math.cos(angle*Math.PI/180.0)*rectLength  || cuboid.pY >= bottomY- Math.sin(angle*Math.PI/180.0)*rectLength)
				{
					numberOfTask--;
					cuboidSlidingDown=false;
					bells.pause();
					bells.currentTime = 0;
					cheer.play();
					clearInterval(interval);
				}

				if(numberOfTask>1)
				{
					--numberOfTask;
					clearInterval(interval);
					
					--numberOfTask;
					runAndDraw(lang);
				}
			}
		, dt*1000);
		}
	}
}

function calcAndDrawNextPosition(bottomX,bottomY,angle,length,cuboid,ctx,canvasElem,dt,lang)
{
	var sina=Math.sin(angle*Math.PI/180.0);
	var cosa=Math.cos(angle*Math.PI/180.0);
	if(lang==0)
	{
		document.getElementById('parametersArticle').innerHTML="time: "+cuboid.time.toFixed(2)+" s"+"<br/>velocity: "+Math.sqrt(cuboid.vX*cuboid.vX+cuboid.vY*cuboid.vY).toFixed(2)+" m/s"+"<br/>acceleration: "+Math.sqrt((cuboid.aX-cuboid.frictionX)*(cuboid.aX-cuboid.frictionX)+(cuboid.aY-cuboid.frictionY)*(cuboid.aY-cuboid.frictionY)).toFixed(2) + " m/s<sup>2</sup>"+"<br/>max coefficient: "+((sina/cosa).toFixed(4));
	}
	else if (lang==1)
	{
		document.getElementById('parametersArticle').innerHTML="czas: "+cuboid.time.toFixed(2)+" s"+"<br/>prędkość: "+Math.sqrt(cuboid.vX*cuboid.vX+cuboid.vY*cuboid.vY).toFixed(2)+" m/s"+"<br/>przyspieszenie: "+Math.sqrt((cuboid.aX-cuboid.frictionX)*(cuboid.aX-cuboid.frictionX)+(cuboid.aY-cuboid.frictionY)*(cuboid.aY-cuboid.frictionY)).toFixed(2) + " m/s<sup>2</sup>"+"<br/>współczynnik graniczny: "+((sina/cosa).toFixed(4));
	}

	ctx.clearRect(0, 0, canvasElem.width, canvasElem.height);
	ctx.fillStyle="#191970";
	ctx.beginPath();
	ctx.moveTo(topX,topY);
	ctx.lineTo(bottomX,bottomY);
	ctx.lineTo(topX,bottomY);
	ctx.fill();
	cuboid.drawCuboid(ctx,angle);
	cuboid.nextPosition(dt);
}

function showOptions()
{
	document.getElementById('advancedOptionsArticle').style.display= 'block';
	document.getElementById('advancedOptionsArticle2').style.display= 'block';
	document.getElementById('moreOptionsButton').style.display= 'none';
	document.getElementById('lessOptionsButton').style.display= 'inline-block';
}

function hideOptions()
{
	document.getElementById('advancedOptionsArticle').style.display= 'none';
	document.getElementById('advancedOptionsArticle2').style.display= 'none';
	document.getElementById('moreOptionsButton').style.display= 'inline-block';
	document.getElementById('lessOptionsButton').style.display= 'none';
}

function muteUnmute()
{
	if(!document.form1.mute.checked)
	{
		bells.volume=1;
		cheer.volume=1;
	}
	if(document.form1.mute.checked)
	{
		bells.volume=0;
		cheer.volume=0;
	}
}
