// ====================================================================
// 1. 全域變數和背景設定 (DynamicShape 相關)
// ====================================================================
let objs = [];
let colors = [
    '#f71735', // 紅
    '#ff8800', // 橘
    '#f7d002', // 黃
    '#1A53C0', // 藍
    '#00d4ff', // 亮藍/青
    '#00cc99', // 綠
    '#8A2BE2'  // 紫羅蘭
];
const BG_COLOR = 20; 

// ====================================================================
// 2. 選單和 Iframe 相關的全域變數
// ====================================================================
let sidebarDiv;
let iframeDiv; // 用於包裹 iframe 的 div 容器
let closeButton; // 關閉按鈕
const MENU_WIDTH = 250;
const TRIGGER_AREA_WIDTH = 50; 
let menuState = 'hidden'; 

// 網址定義
const WORK_URL = "https://shing0411.github.io/20251020/";
const NOTES_URL = "https://hackmd.io/@CSw-vFZYRyGNjY9NVa6a0w/B1-BLm0oxx";

// Iframe 尺寸設定 (使用您設定的 70%)
const IFRAME_SIZE = '70%'; 


// ====================================================================
// 3. SETUP 函式：初始化畫布、選單和 Iframe
// ====================================================================

function setup() {
    // 設置為全螢幕畫布
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);
    angleMode(RADIANS);
    
    // 初始添加形狀
    for (let i = 0; i < 10; i++) {
        objs.push(new DynamicShape());
    }

    // ----------------------------------------------------------------
    // 【Iframe 容器設定】：創建並預設隱藏
    // ----------------------------------------------------------------
    iframeDiv = createDiv('');
    iframeDiv.id('iframe-container');
    
    // Iframe 容器樣式 - 置中並設置為 70% 頁面大小
    iframeDiv.style('position', 'fixed');
    iframeDiv.style('top', '50%');
    iframeDiv.style('left', '50%');
    iframeDiv.style('width', IFRAME_SIZE);
    iframeDiv.style('height', IFRAME_SIZE);
    iframeDiv.style('transform', 'translate(-50%, -50%)'); 
    iframeDiv.style('z-index', '999'); 
    iframeDiv.style('display', 'none'); 
    iframeDiv.style('background-color', 'white'); 
    iframeDiv.style('border', '5px solid #1A53C0'); 
    iframeDiv.style('box-shadow', '0 0 20px rgba(0,0,0,0.8)'); 

    // 創建 Iframe 元素本身
    let iframe = createElement('iframe');
    iframe.attribute('id', 'content-iframe');
    iframe.attribute('frameborder', '0');
    iframe.parent(iframeDiv); 
    iframe.style('width', '100%');
    iframe.style('height', '100%');


    // ----------------------------------------------------------------
    // 【關閉按鈕設定】
    // ----------------------------------------------------------------
    closeButton = createButton('X');
    closeButton.parent(iframeDiv);
    closeButton.style('position', 'absolute');
    closeButton.style('top', '-20px'); 
    closeButton.style('right', '-20px'); 
    closeButton.style('width', '40px');
    closeButton.style('height', '40px');
    closeButton.style('border-radius', '50%');
    closeButton.style('background-color', '#f71735'); 
    closeButton.style('color', 'white');
    closeButton.style('border', 'none');
    closeButton.style('font-size', '20px');
    closeButton.style('cursor', 'pointer');
    closeButton.style('z-index', '1001'); 
    
    closeButton.mousePressed(hideIframe);
    
    // ----------------------------------------------------------------
    // 【選單設定】
    // ----------------------------------------------------------------
    sidebarDiv = createDiv('');
    sidebarDiv.id('sidebar-menu');
    
    // 設置選單的基礎樣式
    sidebarDiv.style('position', 'fixed');
    sidebarDiv.style('top', '0');
    sidebarDiv.style('left', '0');
    sidebarDiv.style('width', MENU_WIDTH + 'px');
    sidebarDiv.style('height', '100vh');
    sidebarDiv.style('background-color', 'rgba(20, 20, 20, 0.95)');
    sidebarDiv.style('box-shadow', '2px 0 10px rgba(0, 0, 0, 0.5)');
    sidebarDiv.style('z-index', '1000'); 
    sidebarDiv.style('padding-top', '50px');
    sidebarDiv.style('transition', 'transform 0.3s ease-in-out');
    
    // 初始隱藏
    sidebarDiv.style('transform', `translateX(-${MENU_WIDTH}px)`);
    
    // 創建選單項目並添加點擊事件
    createMenuItem('第一單元作品', WORK_URL, 'work');
    createMenuItem('第一單元講義', NOTES_URL, 'notes');
    createMenuItem('測驗區', '', 'quiz'); 
    createMenuItem('回到首頁', '', 'home'); 
}

// 輔助函式：創建選單項目
function createMenuItem(text, url, action) {
    let link = createA('#', text); 
    link.parent(sidebarDiv);
    
    // 設置連結樣式
    link.style('display', 'block');
    link.style('padding', '15px 20px');
    link.style('text-decoration', 'none');
    link.style('color', '#f0f0f0');
    link.style('font-size', '32px'); 
    link.style('font-family', 'sans-serif');
    link.style('transition', 'background-color 0.2s, color 0.2s');
    link.style('border-bottom', '1px solid rgba(255, 255, 255, 0.1)');
    
    // 點擊事件監聽器
    link.mousePressed(() => {
        handleMenuClick(action, url);
        return false; // 阻止預設行為
    });

    // 懸停效果
    link.mouseOver(() => {
        link.style('background-color', '#1A53C0');
        link.style('color', 'white');
    });
    link.mouseOut(() => {
        link.style('background-color', 'transparent');
        link.style('color', '#f0f0f0');
    });
}

// ----------------------------------------------------------------
// 隱藏 Iframe 的函式
// ----------------------------------------------------------------
function hideIframe() {
    iframeDiv.style('display', 'none');
    const iframe = document.getElementById('content-iframe');
    iframe.src = ''; 
}

// ----------------------------------------------------------------
// 選單點擊處理函式
// ----------------------------------------------------------------
function handleMenuClick(action, url) {
    const iframe = document.getElementById('content-iframe');

    if (action === 'work' || action === 'notes') {
        iframe.src = url;
        iframeDiv.style('display', 'block');
        menuState = 'hidden';
        sidebarDiv.style('transform', `translateX(-${MENU_WIDTH}px)`);
        
    } else if (action === 'home') {
        hideIframe();
        
    } else if (action === 'quiz') {
        alert('測驗區功能尚未啟用。');
    }
}


// ----------------------------------------------------------------
// P5.JS 內建函式：處理視窗大小調整和滑鼠移動
// ----------------------------------------------------------------
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mouseMoved() {
    if (iframeDiv.style('display') === 'block') {
        return; 
    }
    
    if (mouseX < TRIGGER_AREA_WIDTH && menuState === 'hidden') {
        menuState = 'visible';
        sidebarDiv.style('transform', 'translateX(0)');
    } 
    
    else if (mouseX > MENU_WIDTH + 10 && menuState === 'visible') {
        menuState = 'hidden';
        sidebarDiv.style('transform', `translateX(-${MENU_WIDTH}px)`);
    }
}

// ====================================================================
// 4. DRAW 函式：背景動畫邏輯和文字繪製
// ====================================================================

function draw() {
    background(BG_COLOR); 
    
    // 運行背景動畫
    for (let i of objs) {
        i.run();
    }

    // ----------------------------------------------------------------
    // 【新增】：在畫面中心繪製個人資訊文字
    // ----------------------------------------------------------------
    
    // 僅在 Iframe 隱藏時顯示文字
    if (iframeDiv.style('display') === 'none') {
        push();
        textAlign(CENTER, CENTER);
        
        // 設定文字樣式
        const mainColor = color('#f7d002'); // 使用鮮豔的黃色作為主色
        const shadowColor = color(0, 0, 0, 150); // 半透明黑色陰影
        
        // 文字內容
        const line1 = "淡江教科系";
        const line2 = "414000529";
        const line3 = "王O興";
        
        const textSize1 = width * 0.05; // 大標題字體大小
        const textSize2 = width * 0.03; // 次要資訊字體大小
        const lineHeight = height * 0.08; // 行距

        // 繪製陰影 (讓文字在動態背景上更清晰)
        fill(shadowColor);
        textStyle(BOLD); // 使用粗體
        
        // 陰影偏移
        const shadowOffset = 3;

        // 第一行 (大標題)
        textSize(textSize1);
        text(line1, width / 2 + shadowOffset, height / 2 - lineHeight + shadowOffset);
        
        // 第二行 (學號)
        textSize(textSize2);
        text(line2, width / 2 + shadowOffset, height / 2 + shadowOffset);
        
        // 第三行 (姓名)
        textSize(textSize2);
        text(line3, width / 2 + shadowOffset, height / 2 + lineHeight + shadowOffset);

        // 繪製主文字 (顏色鮮豔)
        fill(mainColor);
        
        // 第一行
        textSize(textSize1);
        text(line1, width / 2, height / 2 - lineHeight);
        
        // 第二行
        textSize(textSize2);
        text(line2, width / 2, height / 2);
        
        // 第三行
        textSize(textSize2);
        text(line3, width / 2, height / 2 + lineHeight);
        
        pop();
    }
    // ----------------------------------------------------------------

    // 背景動畫的粒子生成和移除邏輯
    if (frameCount % int(random([10, 20])) == 0) {
        let addNum = int(random(1, 15)); 
        for (let i = 0; i < addNum; i++) {
            objs.push(new DynamicShape());
        }
    }
    
    for (let i = objs.length - 1; i >= 0; i--) {
        if (objs[i].isDead) {
            objs.splice(i, 1);
        }
    }
}

// ====================================================================
// 5. HELPER 函式和 CLASS (DynamicShape)
// ====================================================================

function easeInOutExpo(x) {
	return x === 0 ? 0 :
		x === 1 ?
		1 :
		x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 :
		(2 - Math.pow(2, -20 * x + 10)) / 2;
}

class DynamicShape {
	constructor() {
        this.x = random(width);
		this.y = random(height);
		this.reductionRatio = 1;
		this.shapeType = int(random(6)); 
		this.animationType = int(random(4)); 
		this.maxActionPoints = int(random(3, 7)); 
		this.actionPoints = this.maxActionPoints;
		this.elapsedT = 0;
		this.size = 0;
		this.sizeMax = width * random(0.01, 0.04); 
		this.fromSize = 0;
		this.init();
		this.isDead = false;
		this.baseClr = color(random(colors));
        this.clr = this.baseClr;
		this.changeShape = true;
		this.ang = random(PI * 2);
        this.angVelocity = random(-0.02, 0.02); 
		this.lineSW = 0;
	}

	show() {
		push();
		translate(this.x, this.y);
        
        this.ang += this.angVelocity;
        rotate(this.ang); 

		if (this.animationType == 1) scale(1, this.reductionRatio);
		if (this.animationType == 2) scale(this.reductionRatio, 1);
        
        let alpha = map(this.actionPoints, 0, this.maxActionPoints, 0, 255, true);
        this.clr = color(red(this.baseClr), green(this.baseClr), blue(this.baseClr), alpha);

        stroke(this.clr);
		strokeWeight(this.size * 0.05 + 1); 

		if (this.shapeType == 0) {
            fill(this.clr);
			noStroke();
			circle(0, 0, this.size);
		} else if (this.shapeType == 1) {
			noFill();
			circle(0, 0, this.size);
		} else if (this.shapeType == 2) {
			fill(this.clr);
			noStroke();
			rect(0, 0, this.size, this.size);
		} else if (this.shapeType == 3) {
			noFill();
			rect(0, 0, this.size * 0.9, this.size * 0.9);
		} else if (this.shapeType == 4) {
            noFill();
            strokeWeight(this.size * 0.1);
			line(0, -this.size * 0.45, 0, this.size * 0.45);
			line(-this.size * 0.45, 0, this.size * 0.45, 0);
		} else if (this.shapeType == 5) {
            noFill();
            let r = this.size / 2;
            triangle(0, -r, r * cos(PI/6), r * sin(PI/6), -r * cos(PI/6), r * sin(PI/6));
        }

		pop();
	}

	move() {
		let n = easeInOutExpo(norm(this.elapsedT, 0, this.duration));
        
		if (0 < this.elapsedT && this.elapsedT < this.duration) {
			if (this.actionPoints == this.maxActionPoints) {
				this.size = lerp(0, this.sizeMax, n);
			} else if (this.actionPoints > 0) {
				if (this.animationType == 0) {
					this.size = lerp(this.fromSize, this.toSize, n);
				} else if (this.animationType == 1) {
					this.x = lerp(this.fromX, this.toX, n);
					this.lineSW = 0; 
				} else if (this.animationType == 2) {
					this.y = lerp(this.fromY, this.toY, n);
					this.lineSW = 0; 
				} else if (this.animationType == 3) {
					if (this.changeShape == true) {
						this.shapeType = int(random(6)); 
						this.changeShape = false;
					}
				}
				this.reductionRatio = lerp(1, 0.4, sin(n * PI));
			} else {
				this.size = lerp(this.fromSize, 0, n);
			}
		}

		this.elapsedT++;
		if (this.elapsedT > this.duration) {
			this.actionPoints--;
			this.init(); 
		}
		if (this.actionPoints < 0) {
			this.isDead = true; 
		}
	}

	run() {
		this.show();
		this.move();
	}

	init() {
		this.elapsedT = 0;
		this.fromSize = this.size;
		this.toSize = this.sizeMax * random(0.8, 1.2); 
		
		this.fromX = this.x;
		this.toX = constrain(this.fromX + (width / 20) * random([-1, 1]) * int(random(1, 5)), 0, width);
		this.fromY = this.y;
		this.toY = constrain(this.fromY + (height / 20) * random([-1, 1]) * int(random(1, 5)), 0, height);
        
		this.animationType = int(random(4)); 
		this.duration = random(30, 70); 
		this.changeShape = true;
	}
}