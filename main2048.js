//游戏数据
var board = new Array();
var score = 0;

//记录每个小格子是否已经发生过了叠加
var hasConflicted = new Array();

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function(){
	prepareForMobile();
	newgame();
});

function prepareForMobile(){
	if( documentWidth > 500){
		gridContainerWidth = 500;
		cellSpace = 20;
		cellSideLength = 100;
	}

	$("#grid-container").css('width', gridContainerWidth - 2*cellSpace);
	$("#grid-container").css('height', gridContainerWidth - 2*cellSpace);
	$("#grid-container").css('padding', cellSpace);
	$("#grid-container").css('border-radius', gridContainerWidth * 0.02);

	$(".grid-cell").css('width', cellSideLength);
	$(".grid-cell").css('height', cellSideLength);
	$(".grid-cell").css('border-radius', cellSideLength * 0.02);
}

function newgame(){
	//初始化棋盘格
	init();
	//在随机两个格子生成数子
	generateOneNumber();
	generateOneNumber();
}

function init(){
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			var gridCell = $("#grid-cell-"+i+"-"+j);
			gridCell.css("top",getPosTop(i, j));
			gridCell.css("left",getPosLeft(i, j));
		}
	}
	for (var i = 0; i < 4; i++) {
		board[i] = new Array();
		hasConflicted[i] = new Array();
		for (var j = 0; j < 4; j++) {
			board[i][j] = 0;
			hasConflicted[i][j] = false;	
		}
	}
	updateBoardView();

	score = 0;
	$("#score").text( 0 );
}
	
function updateBoardView(){
	$(".number-cell").remove();
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var theNumberCell = $('#number-cell-'+i+'-'+j);
			if(board[i][j] == 0 ){
				theNumberCell.css("width", '0px');
				theNumberCell.css("height", '0px');
				theNumberCell.css("top", getPosTop(i, j) + cellSideLength/2);
				theNumberCell.css("left", getPosLeft(i, j) + cellSideLength/2);
			}else{
				theNumberCell.css("width", cellSideLength);
				theNumberCell.css("height", cellSideLength);
				theNumberCell.css("top", getPosTop(i, j));
				theNumberCell.css("left", getPosLeft(i, j));
				theNumberCell.css("background-color", getNumberBackgroundColor(board[i][j]));
				theNumberCell.css("color", getNumberColor(board[i][j]));
				theNumberCell.text( board[i][j] );

			}
			hasConflicted[i][j] = false;
		}
	};
		$('.number-cell').css('line-height', cellSideLength + 'px');
		$('.number-cell').css('font-size', 0.6 * cellSideLength + 'px');
}

function generateOneNumber(){
	if (nospace(board)){
		return false;
	}
	//随机一个位置
	var randx = parseInt(Math.floor(Math.random() * 4));
	var randy = parseInt(Math.floor(Math.random() * 4));
	//设置自动生成位置为，50此以内
	var times = 0;
	while(times < 50){
		if(board[randx][randy] == 0){
			break;
		}else{
			randx = parseInt(Math.floor(Math.random() * 4));
			randy = parseInt(Math.floor(Math.random() * 4));
		}
		times ++;
	}
	//若50次位置找不到为0，则人工找生成的位置
	if(times == 50){
		for (var i = 0; i < 4; i++) {
			for(var j = 0; j < 4; j++){
				if(board[i][j] == 0){
					randx = i;
					randy = j;
				}
			}	
		}
	}
	//随机一个数字
	var randNumber = Math.random() < 0.5 ? 2 :4;

	//随机位置显示数字
	board[randx][randy] = randNumber;

	showNumberWithAnimation(randx, randy, randNumber);
	return true;
}

$(document).keydown(function(event) {
	event.preventDefault(); //阻挡默认的效果（该例中去除滚动条滚动效果）
	switch(event.keyCode){
		case 37: //left
			if( moveLeft() ){
				//为了动画播放完整，延时设置
				setTimeout('generateOneNumber()',210);
				
				setTimeout('isgameover()',210);
			}
			break;
		case 38: //up
			if( moveUp() ){
				setTimeout('generateOneNumber()',210);
				
				setTimeout('isgameover()',210);
			}
			break;
		case 39: //right
			if( moveRight() ){
				setTimeout('generateOneNumber()',210);
				
				setTimeout('isgameover()',210);
			}
			break;
		case 40: //down
			if( moveDown() ){
				setTimeout('generateOneNumber()',210);
				
				setTimeout('isgameover()',210);
			}
			break;
		default:
			break;
	}
})

document.addEventListener('touchstart', function(event){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
})

document.addEventListener('touchmove', function(event){
	event.preventDefault(); 
})

document.addEventListener('touchend', function(event){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;

	var deltax = endx - startx;
	var deltay = endy - starty;
	//去除当用户点击移动的效果
	if(Math.abs( deltax ) < 0.2 * documentWidth && Math.abs( deltay ) < 0.2 * documentWidth){
		return;
	}
	//x轴
	if(Math.abs( deltax ) >= Math.abs( deltay )){
		if(deltax < 0){
			//move left
			if( moveLeft() ){
				//为了动画播放完整，延时设置
				setTimeout('generateOneNumber()',210);
				
				setTimeout('isgameover()',210);
			}
		}else{
			//move right
			if( moveRight() ){
				setTimeout('generateOneNumber()',210);
				
				setTimeout('isgameover()',210);
			}
		}
	}else{   //y轴
		if(deltay > 0){
			//move down
			if( moveDown() ){
				setTimeout('generateOneNumber()',210);
				
				setTimeout('isgameover()',210);
			}
		}else{
			//move up
			if( moveUp() ){
				setTimeout('generateOneNumber()',210);
				
				setTimeout('isgameover()',210);
			}
		}	
	}
})

//游戏结束
function isgameover(){
	if( nospace(board) && nomove( board ) ){
		gameover();
	}
}

function gameover(){
	alert("游戏结束！");
}

function moveLeft(){
	if( !canMoveLeft( board ) ){
		return false;
	}
	//moveLeft
	for (var i = 0; i < 4; i++) {
		for(var j = 1; j < 4; j++){
			if(board[i][j] != 0){ //有可能向左移动
				for (var k = 0; k < j; k++) {
					if(board[i][k] == 0 && noBlockHorizontal(i, k, j, board)){
						//产生移动
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]){
						//产生移动
						showMoveAnimation(i, j, i, k);
						//叠加数字
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//加分情况
						score += board[i][k];
						updateScore( score );
						//发生碰撞了
						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}	
	}
	setTimeout("updateBoardView()", 200);	
	return true;
}

function moveUp(){
	if( !canMoveUp( board ) ){
		return false;
	}
	//moveUp
	for (var i = 0; i < 4; i++) {
		for(var j = 1; j < 4; j++){
			if(board[j][i] != 0){
				for (var k = 0; k < j; k++) {
					if(board[k][i] == 0 && noBlockVertical(i, k, j, board) ){
						//向上移动
						showMoveAnimation(j, i, k, i);
						board[k][i] = board[j][i];
						board[j][i] = 0;
						continue;
					}else if(board[k][i] == board[j][i] && noBlockVertical(i, k, j, board) && !hasConflicted[k][i]){
						//向上移动
						showMoveAnimation(j, i, k, i);
						//数字叠加
						board[k][i] += board[j][i];
						board[j][i] = 0;
						//加分情况
						score += board[k][i];
						updateScore( score );
						hasConflicted[k][i] = true;
						continue;
					}

				}
			}			
		}
	}
	setTimeout("updateBoardView()", 200);	
	return true;
}

function moveRight(){
	if( !canMoveRight(board)){
		return false;
	}
	for (var i = 0; i < 4; i++) {
		for( var j = 2 ; j >= 0 ; j -- ){
			if(board[i][j] != 0){
				for( var k = 3 ; k > j ; k -- ){
					if(board[i][k] == 0 && noBlockHorizontal(i, j, k, board)){
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]){
						showMoveAnimation(i, j, i, k);
						board[i][k] *= 2;
						board[i][j] = 0;
						//加分情况
						score += board[i][k];
						updateScore( score );

						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}	
	}
	setTimeout("updateBoardView()", 200);
	return true;
}

function moveDown(){
	if( !canMoveDown(board) ){
		return false;
	}
	for (var i = 2; i >= 0; i--) {
		for(var j = 0; j < 4; j++){
			if(board[i][j] != 0){
				for(var k = 3; k > i; k--){
					if(board[k][j] == 0 && noBlockVertical(j, i, k, board) ){

						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]){
						showMoveAnimation(i, j, k, j);
						board[k][j] *= 2;
						board[i][j] = 0;
						//加分情况
						score += board[k][j];
						updateScore( score );
						hasConflicted[k][j] = true;
						continue;
					}
				}				
			}
		}	
	}
	setTimeout('updateBoardView()',200)

	return true;
}

function updateScore(score){
	$("#score").text( score );
}