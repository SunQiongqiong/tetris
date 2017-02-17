function Cell(r,c,src){//描述所有格子对象的构造函数
	this.r=r;//格子所在行下标
	this.c=c;//格子所在列下标
	this.src=src;//格子使用图片路径
}
//定义描述旋转状态的构造函数
function State(r0,c0,r1,c1,r2,c2,r3,c3){
	this.r0=r0; this.c0=c0;
	this.r1=r1; this.c1=c1;
	this.r2=r2; this.c2=c2;
	this.r3=r3; this.c3=c3;
}
//描述所有图形的公共属性和方法的对象
function Shape(cells,src,orgi,states){
	this.cells=cells;
	this.orgi=orgi;//初始化当前图形对象的参照格下标
	this.states=states;//初始化
	this.statei=0;
	for(var i=0;i<this.cells.length;i++){//遍历cells中每个格子
		this.cells[i].src=src;// 设置当前格的src为src
	}
}
//在父类型的原型对象中集中定义所有图形的图片路径
Shape.prototype.IMGS={
	T:"img/T.png",
	I:"img/I.png",
	O:"img/O.png",
	L:"img/L.png",
	S:"img/S.png",
	J:"img/J.png",
	Z:"img/Z.png"
}
Shape.prototype.moveDown=function(){//this->shape
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].r++;
	}
}
Shape.prototype.moveLeft=function(){//this->shape
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].c--;
	}
}
Shape.prototype.moveRight=function(){//this->shape
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].c++;
	}
}
Shape.prototype.rotate=function(){
	var state=this.states[this.statei];
	var orgCell=this.cells[this.orgi];
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].r=orgCell.r+state["r"+i];
		this.cells[i].c=orgCell.c+state["c"+i];
	}
}
Shape.prototype.rotateR=function(){//顺时针旋转一次
	this.statei++;
	if(this.statei>=this.states.length){
		this.statei=0;
	}
	this.rotate();
}
Shape.prototype.rotateL=function(){//逆时针旋转一次
	this.statei--;
	if(this.statei<0){
		this.statei=this.states.length-1;
	}
	this.rotate();
}
function T(){//创建T类型的构造函数，同时让T类型继承Shape
	Shape.apply(this,[
		[//cells参数：保存四个cell对象
			new Cell(0,3),new Cell(0,4),new Cell(0,5),new Cell(1,4)
		],
		this.IMGS.T,
		1,
		[
			new State(0,-1,0,0,0,1,1,0),
			new State(-1,0,0,0,1,0,0,-1),
			new State(0,1,0,0,0,-1,-1,0),
			new State(1,0,0,0,-1,0,0,1)
		]
	]);
}
function I(){//创建I类型的构造函数，同时让I类型继承Shape
	Shape.apply(this,[
		[//cells参数：保存四个cell对象
			new Cell(0,3),new Cell(0,4),new Cell(0,5),new Cell(0,6)
		],
		this.IMGS.I,
		1,
		[
			new State(0,-1,0,0,0,1,0,2),
			new State(-1,0,0,0,1,0,2,0)
		]
	]);
}
function O(){//创建O类型的构造函数，同时让O类型继承Shape
	Shape.apply(this,[
		[//cells参数：保存四个cell对象
			new Cell(0,4),new Cell(0,5),new Cell(1,4),new Cell(1,5)
		],
		this.IMGS.O,
		0,
		[
			new State(0,0,0,1,1,0,1,1)
		]
	]);
}
function L(){//创建L类型的构造函数，同时让L类型继承Shape
	Shape.apply(this,[
		[//cells参数：保存四个cell对象
			new Cell(0,3),new Cell(0,4),new Cell(0,5),new Cell(1,3)
		],
		this.IMGS.L,
		1,
		[
			new State(0,-1,0,0,0,1,1,-1),
			new State(-1,0,0,0,1,0,-1,-1),
			new State(0,1,0,0,0,-1,-1,1),
			new State(1,0,0,0,-1,0,1,1)
		]
	]);
}
function Z(){//创建Z类型的构造函数，同时让Z类型继承Shape
	Shape.apply(this,[
		[//cells参数：保存四个cell对象
			new Cell(0,3),new Cell(0,4),new Cell(1,4),new Cell(1,5)
		],
		this.IMGS.Z,
		2,
		[
			new State(-1,-1,-1,0,0,0,0,1),
			new State(-1,1,0,1,0,0,1,0)
		]
	]);
}
function S(){//创建S类型的构造函数，同时让S类型继承Shape
	Shape.apply(this,[
		[//cells参数：保存四个cell对象
			new Cell(0,4),new Cell(0,5),new Cell(1,3),new Cell(1,4)
		],
		this.IMGS.S,
		3,
		[
			new State(-1,0,-1,1,0,-1,0,0),
			new State(0,1,1,1,-1,0,0,0),
		]
	]);
}
function J(){//创建J类型的构造函数，同时让J类型继承Shape
	Shape.apply(this,[
		[//cells参数：保存四个cell对象
			new Cell(0,3),new Cell(0,4),new Cell(0,5),new Cell(1,5)
		],
		this.IMGS.J,
		1,
		[
			new State(-1,0,0,0,1,0,1,-1),
			new State(0,1,0,0,0,-1,-1,-1),
			new State(1,0,0,0,-1,0,-1,1),
			new State(0,-1,0,0,0,1,1,1),
		]
	]);
}
//让子类型的原型对象，继承父类型的原型对象
Object.setPrototypeOf(T.prototype,Shape.prototype);
Object.setPrototypeOf(I.prototype,Shape.prototype);
Object.setPrototypeOf(O.prototype,Shape.prototype);
Object.setPrototypeOf(L.prototype,Shape.prototype);
Object.setPrototypeOf(Z.prototype,Shape.prototype);
Object.setPrototypeOf(S.prototype,Shape.prototype);
Object.setPrototypeOf(J.prototype,Shape.prototype);
/*//描述所有格子对象的构造函数
function Cell(r,c,src){
	this.r=r;//格子行下标
	this.c=c;//格子列下标
	this.src=src;//格子使用的图片路径
}
function Shape(cells,src){
	this.cells=cells;
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].src=src;
	}
}
Shape.prototype.IMGS={
	T:"img/T.png",I:"img/I.png",J:"img/J.png",L:"img/L.png",O:"img/O.png",S:"img/S.png",Z:"img/Z.png"
}
Shape.prototype.moveDown=function(){
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].r++;
	}
}
Shape.prototype.moveLeft=function(){
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].c--;
	}
}
Shape.prototype.moveRight=function(){
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].c++;
	}
}
function T(){
	Shape.apply(this,[[new Cell(0,3),new Cell(0,4),new Cell(0,5),new Cell(1,4)],
	this.IMGS.T]);
}
function O(){
	Shape.apply(this,[[new Cell(0,4),new Cell(0,5),new Cell(1,4),new Cell(1,5)],
	this.IMGS.O]);
}
function I(){
	Shape.apply(this,[[new Cell(0,3),new Cell(0,4),new Cell(0,5),new Cell(0,6)],
	this.IMGS.I]);
}
function J(){
	Shape.apply(this,[[new Cell(0,4),new Cell(1,4),new Cell(2,4),new Cell(2,3)],
	this.IMGS.J]);
}
function L(){
	Shape.apply(this,[[new Cell(0,4),new Cell(1,4),new Cell(2,4),new Cell(2,5)],
	this.IMGS.L]);
}
function S(){
	Shape.apply(this,[[new Cell(0,4),new Cell(0,5),new Cell(1,3),new Cell(1,4)],
	this.IMGS.S]);
}
function Z(){
	Shape.apply(this,[[new Cell(0,3),new Cell(0,4),new Cell(1,4),new Cell(1,5)],
	this.IMGS.Z]);
}
Object.setPrototypeOf(T.prototype,Shape.prototype);
Object.setPrototypeOf(O.prototype,Shape.prototype);
Object.setPrototypeOf(I.prototype,Shape.prototype);
Object.setPrototypeOf(J.prototype,Shape.prototype);
Object.setPrototypeOf(L.prototype,Shape.prototype);
Object.setPrototypeOf(S.prototype,Shape.prototype);
Object.setPrototypeOf(Z.prototype,Shape.prototype);*/























