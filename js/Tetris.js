function $(id){
	return document.getElementById(id);
}
var tetris={//游戏主程序对象
	CSIZE:26,//保存每个格子的宽高
	RN:20,//总行数
	CN:10,//总列数
	OFFSET:15,//保存单元格区域距游戏界面边界的内边距
	shape:null,//保存当前正在下落的主角图形
	nextShape:null,//保存下一个备胎图形
	timer:null,
	wall:null,//保存所有停止的方块
	INTERVAL:200,
	score:0,
	lines:0,//保存消除的总行数
	level:1,
	SCORES:[0,10,50,80,200],
	state:1,//保存游戏状态
	RUNNING:1,//运行状态
	PAUSE:2,//暂停状态
	GAMEOVER:0,//游戏结束
	start:function(){//启动游戏
		this.state=this.RUNNING;
		this.lines=0;
		this.score=0;
		this.level=0;
		this.shape=this.randomShape();//随机生成开始的图形对象
		this.nextShape=this.randomShape();//随机生成备胎图形对象
		this.wall=[];//初始化方块墙
		//向wall中添加RN个行，每行初始化CN个空数组
		for(var i=0;i<this.RN;i++){
			this.wall.push(new Array(this.CN));
		}
		//var me=this;
		document.onkeydown=function(e){
			var e=e||window.event;
			switch(e.keyCode){
				case 37: this.state==this.RUNNING&&this.moveLeft();break;
				case 39: this.state==this.RUNNING&&this.moveRight();break;
				case 40: this.state==this.RUNNING&&this.moveDown();break;
				case 38: this.state==this.RUNNING&&this.rotateR();break;
				case 90: this.state==this.RUNNING&&this.rotateL();break;
				case 83: this.state==this.GAMEOVER&&this.start();break;
				case 67: this.state==this.PAUSE&&this.myContinue();break;
				case 80: this.state==this.RUNNING&&this.pause();break;
				case 81: this.gameOver();break;
			}
		}.bind(this);
		this.timer=setInterval(this.moveDown.bind(this),this.INTERVAL);//启动游戏下落动画
		this.paint();//重绘一切
	},
	gameOver:function(){
		this.state=this.GAMEOVER;
		clearInterval(this.timer);
		this.timer=null;
		this.paint();
	},
	myContinue:function(){//从暂停状态恢复运行状态
		this.state=this.RUNNING;
	},
	pause:function(){
		this.state=this.PAUSE;
		//this.paint();
	},
	canRotate:function(){//当前旋转后的图形，是否有越界和冲突
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.r<0||cell.r>=this.RN||cell.c<0||cell.c>=this.CN){
				return false;
			}else if(cell.r<this.RN&&this.wall[cell.r][cell.c]){
				return false;
			}	
		}
		return true;
	},
	rotateR:function(){//让主角图形顺时针旋转
		this.shape.rotateR();
		if(!this.canRotate()){
			this.shape.rotateL();
		}
	},
	rotateL:function(){//让主角图形逆时针旋转
		this.shape.rotateL();
		if(!this.canRotate()){
			this.shape.rotateR();
		}
	},
	randomShape:function(){//在七个图形中随机生成一个
		var r=parseInt(Math.random()*(6+1));
		/*return new O();*/
		switch(r){
			case 0 : return new T();break;//如果r是0；就返回一个新的T图形对象
			case 1 : return new O();break;
			case 2 : return new I();break;
			case 3 : return new L();break;
			case 4 : return new S();break;
			case 5 : return new Z();break;
			case 6 : return new J();break;
		}
	},
	landIntoWall:function(){//将停止下落的方块保存到wall中相同位置
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			this.wall[cell.r][cell.c]=cell;
		}
	},
	moveDown:function(){//将主角图形下落一步，重绘一切
		if(this.state==this.RUNNING){
			if(this.canDown()){
				this.shape.moveDown();	
			}else{
				this.landIntoWall();//先将shape中的格搬到wall中保存
				var ls=this.deleteRows();//判断并消除行，返回消除行数
				this.lines+=ls;
				this.score+=this.SCORES[ls];
				if(!this.isGameOver()){
					this.shape=this.nextShape;
					this.nextShape=this.randomShape();
				}else{
					this.state=this.GAMEOVER;
					clearInterval(this.timer);
					this.timer=null;
				}
			}
		}
		this.paint();
	},
	paintState:function(){//根据游戏状态,添加对应图片
		if(this.state!=this.RUNNING){
			var img=new Image();
			img.src=this.state==this.PAUSE?"img/pause.png":"img/game-over.png";
			$("pg").appendChild(img);
		}
	},
	isGameOver:function(){//检查游戏是否结束
		for(var i=0;i<this.nextShape.cells.length;i++){
			var cell=this.nextShape.cells[i];
			if(this.wall[cell.r][cell.c]){
				return true;
			}
		}
		return false;
	},
	deleteRows:function(){//删除所有满格行
		for(var r=this.RN-1,ls=0;r>=0;r--){//自底向上遍历每一行
			if(this.isFullRow(r)){
				this.deleteRow(r);
				ls++;
				r++;//r留在原地，判断落下来的那一行是不是满格行
				if(ls==4){break};
			}
		}
		return ls;
	},
	deleteRow:function(delr){//删除指定行
		for(var r=delr;r>0;r--){
			this.wall[r]=this.wall[r-1];
			for(var c=0;c<this.CN;c++){
				if(this.wall[r][c]){//如果当前cell有效
					this.wall[r][c].r++;
				}
			}
			this.wall[r-1]=new Array(this.CN);
			if(this.wall[r-2].join("")==""){break;}
		}
	},
	isFullRow:function(r){//检查当前行是否是满格行
		if(String(this.wall[r]).search(/^,|,,|,$/)!=-1){
			return false;
		}else{
			return true;
		}
	},
	canDown:function(){//判断主角图形是否可以继续下落
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			//判断当前图形有没有到达底部(cell的等于RN-1)
			if(cell.r==this.RN-1||this.wall[cell.r+1][cell.c]){
				
				return false;
			}
		}
		return true;
	},
	moveLeft:function(){//让shape左移一次
		if(this.canLeft()){
			this.shape.moveLeft();
		}
	},
	canLeft:function(){//能否左移
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.c==0||this.wall[cell.r][cell.c-1]){
				return false;
			}
		}
		return true;
	},
	moveRight:function(){//让shape右移一次
		if(this.canRight()){
			this.shape.moveRight();
		}
	},
	canRight:function(){//能否右移
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.c==this.CN-1||this.wall[cell.r][cell.c+1]){
				return false;
			}
		}
		return true;
	},
	paintNext:function(){//在右上角绘制备胎
		var frag=document.createDocumentFragment();
		for(var i=0;i<this.nextShape.cells.length;i++){
			var cell=this.nextShape.cells[i];
			var img=new Image();
			img.src=cell.src;
			img.style.top=this.CSIZE*(cell.r+1)+this.OFFSET+"px";
			img.style.left=this.CSIZE*(cell.c+10)+this.OFFSET+"px";
			frag.appendChild(img);
		}
		$("pg").appendChild(frag);
	},
	paintWall:function(){//绘制墙中所有格
		var frag=document.createDocumentFragment();
		for(var r=this.RN-1;r>0;r--){
			if(this.wall[r].join("")){//如果当前行不是空行
				for(var c=0;c<this.CN;c++){
					var cell=this.wall[r][c];
					if(cell){//如果cell有效
						var img=new Image();//创建Image元素，保存在变量img中
						img.src=cell.src;//设置img的src为cell的src
						img.style.top=this.OFFSET+cell.r*this.CSIZE+"px";
						img.style.left=this.OFFSET+cell.c*this.CSIZE+"px";
						frag.appendChild(img);//将img追加到frag中
					}
				}
			}else{//是空行，剩余的行不再遍历
				break;
			}
		}
		$("pg").appendChild(frag);
	},
	paint:function(){//重绘一切
		$("pg").innerHTML=$("pg").innerHTML.replace(/<img(.*?)>/gi,"");
		this.paintShape();//重绘主角图形
		this.paintNext();//重绘主角图形
		this.paintWall();//重绘方块墙
		this.paintScore();//重绘分数
		this.paintState();//重绘图片
	},
	paintScore:function(){
		$('score').innerHTML=this.score;
		$('lines').innerHTML=this.lines;
		$('level').innerHTML=this.level;
		
	},
	paintShape:function(){//绘制主角图形
		var frag=document.createDocumentFragment();//先创建一个文档片段frag
		for(var i=0;i<this.shape.cells.length;i++){//遍历主角图形的cells数组中的每个cell对象
			var cell=this.shape.cells[i];//将当前格子对象,临时保存在变量cell中
			var img=new Image();//创建Image元素，保存在变量img中
			img.src=cell.src;//设置img的src为cell的src
			img.style.top=this.OFFSET+cell.r*this.CSIZE+"px";
			img.style.left=this.OFFSET+cell.c*this.CSIZE+"px";
			frag.appendChild(img);//将img追加到frag中
		}
		$("pg").appendChild(frag);//(遍历结束)将frag追加到id为pg的元素下
	},
}
window.onload=function(){
	tetris.start();
}










