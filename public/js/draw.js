var MyCanvas = {
	data: {
		initData: initData
	},
	wordsWrap(ctx, name, maxWidth, startX, srartY, wordsHight) {
		let lineWidth = 0;
		let lastSubStrIndex = 0;
		for(let i = 0; i < name.length; i++) {
			lineWidth += ctx.measureText(name[i]).width;
			if(lineWidth > maxWidth) {
				ctx.fillText(name.substring(lastSubStrIndex, i), startX, srartY);
				srartY += wordsHight;
				lineWidth = 0;
				lastSubStrIndex = i;
			}
			if(i == name.length - 1) {
				ctx.fillText(name.substring(lastSubStrIndex, i + 1), startX, srartY);
			}
		}
	},
	drawHead(context, url, x, y, radius) {
		//定位头像  
		context.save();
		context.fillStyle = "slateblue";
		context.beginPath();
		context.arc(x, y, radius, 0, Math.PI * 2, true);
		context.closePath();
		context.clip();
		this.drawPic(context, url, x - radius, y - radius, radius * 2, radius * 2)
		context.restore();
	},
	drawPic(ctx, src, ...args) {
		ctx.drawImage(src, ...args);
		/*var img = new Image();
		img.src = src;
		img.onload = () => {
			ctx.drawImage(img, ...args);
		}*/
	},
	loadImage(url) {
		return new Promise((resolve) => {
			const img = new Image();
			img.setAttribute("crossOrigin", 'anonymous');
			img.onload = () => resolve(img);
			img.src = url;
		})
	},
	createCanvas(nickName, headPic) {
		var me = this;
		me.data.nickname = nickName
		//随机背景
		var randomBgNum = Math.floor(Math.random() * me.data.initData.length);
		var checkGroup = me.data.initData[randomBgNum]
		var bgpic = checkGroup.bg;
		var headPosition = checkGroup.headPosition;
		var randomLg = Math.floor(Math.random() * checkGroup.lg.length);
		var lgGroup = checkGroup.lg[randomLg];
		var canvas = document.getElementById('shareFrends');
		var context = canvas.getContext('2d');
		Promise.all([
			this.loadImage(bgpic),
			this.loadImage("images/logo.jpg"),
			this.loadImage("images/spCode.jpg"),
			this.loadImage(headPic),
		]).then(picAry => {
			context.drawImage(picAry[0], 0, 0);
			me.drawImg(context, lgGroup, randomBgNum, randomLg, headPosition, canvas, picAry);
			var myImg = document.getElementById("showPic");
			myImg.src = canvas.toDataURL("image/png");
		})

		setTimeout(function() {
			var image = document.getElementById("showPic");
			image.src = canvas.toDataURL("image/png");
		}, 1000)
	},

	drawImg(context, lgGroup, randomBgNum, randomLg, headPosition, canvas, picAry) {
		var me = this;
		context.fillStyle = "#000";
		context.font = "24px sans-serif";
		context.fillText(me.data.nickname, 120, 150)
		context.font = "normal 14px sans-serif";
		context.font = "24px sans-serif";
		for(let key in lgGroup) {
			lgGroup[key].forEach((item, index) => {
				let _x = 30,
					_y = 200,
					max_w = 300 / lgGroup[0].length,
					_h = 28;
				switch(key) {
					case "1":
						_x = _x + 450, _y = _y, max_w = 230;
						break
					case "2":
						_x = _x, _y = _y + 310, max_w = 200;
						if(randomBgNum == 1 && randomLg == 2) _x = _x + 120;
						if(randomBgNum == 3) _x = _x + 120, _y = _y + 100, max_w = 100;
						break
					case "3":
						_x = _x + 550, _y = _y + 340, max_w = 100;
						if(randomBgNum == 3) _x = _x - 190, _y = _y - 30, max_w = 200;
						break
					case "4":
						_x = _x + 180, _y = _y + 615, max_w = 350;
						if(randomBgNum == 3)
							_x = _x + 150, _y = _y + 50;
						break
					default:
						_x = 30, _y = 240
						break;
				}
				switch(index) {
					case 0:
						this.wordsWrap(context, item, max_w, _x, _y, _h)
						break
					case 1:
						if(randomBgNum == 2 && randomLg == 2) {
							this.wordsWrap(context, item, 180, _x + 180, _y, _h)
						} else {
							if(randomBgNum == 2 && randomLg == 0)
								this.wordsWrap(context, item, max_w, _x + 120, _y + 100, _h)
							else
								this.wordsWrap(context, item, max_w, _x + 150, _y + 100, _h)
						}
						break
					default:
						console.log("默认");
						break;
				}
			})
		}
		headPosition.forEach(item => {
			this.drawHead(context, picAry[3], item.x, item.y, item.z);
		})
		me.drawPic(context, picAry[1], 25, 1090, 100, 100)
		me.drawPic(context, picAry[2], 150, 1090, 100, 100)
	}
}