enchant();

window.onload = function () {
	const game = new Game(400, 500);  				//画面サイズを400*500にする。（このサイズだとスマホでも快適なのでおススメ）

	/////////////////////////////////////////////////
	//ゲーム開始前に必要な画像・音を読み込む部分


	//クリック音読み込み
	const clickSndUrl = "click.wav";						//game.htmlからの相対パス
	game.preload([clickSndUrl]); 				//データを読み込んでおく


	//リトライボタン
	const retryImgUrl = "retry.png";						//game.htmlからの相対パス
	game.preload([retryImgUrl]);					//データを読み込んでおく

	//ツイートボタン
	const tweetImgUrl = "tweet.png";						//game.htmlからの相対パス
	game.preload([tweetImgUrl]);					//データを読み込んでおく		

	//CenterのYellow
	const yellowImgUrl = 'ALESSExPicYellow.png';
	game.preload([yellowImgUrl]);

	//targetのRed
	const RedImgUrl = 'ALESSExPicRed.png';
	game.preload([RedImgUrl]);

	//finishBtn
	const finishBtnImgUrl = "ALESSExPicFin.png";
	game.preload([finishBtnImgUrl]);

	//読み込み終わり
	/////////////////////////////////////////////////


	game.onload = function () {					//ロードが終わった後にこの関数が呼び出されるので、この関数内にゲームのプログラムを書こう

		/////////////////////////////////////////////////
		//グローバル変数 

		let started = false;						//centerボタンが押されてからtargetが押されるまでtrue
		let startTime = 0;							//centerボタンが押された時刻
		let timeRequired = [];						//結果を記録するリスト
		
		//各種変数（状況に依り変える）
		let center_posi_x = 200;
		let center_posi_y = 250;
		let center_size_x = 30;
		let center_size_y = 10;
		let target_size_x = 30;
		let target_size_y = 10;
		
		
		let positions = [[200,0], [200,45], [200,90], [200,135], [200,180], [200,225], [200,270], [200,315]];
		let state = 0;

		//グローバル変数終わり
		/////////////////////////////////////////////////

		

		const mainScene = new Scene();					//シーン作成
		game.pushScene(mainScene);  					//mainSceneシーンオブジェクトを画面に設置
		mainScene.backgroundColor = "black"; 			//mainSceneシーンの背景は黒くした


		//Centerボタン
		const centerImg = new Sprite(center_size_x, center_size_y);
		centerImg.moveTo(center_posi_x, center_posi_y);
		centerImg.image = game.assets[yellowImgUrl];
		mainScene.addChild(centerImg);

		//targetボタン
		let target_posi_x = center_posi_x + positions[state][0] * Math.cos(positions[state][1] * Math.PI / 180);
		let target_posi_y = center_posi_y - positions[state][0] * Math.sin(positions[state][1] * Math.PI / 180);

		const targetImg = new Sprite(target_size_x, target_size_y);
		targetImg.moveTo(target_posi_x, target_posi_y);
		targetImg.image = game.assets[RedImgUrl];
		mainScene.addChild(targetImg);


		//timePassed文字列
		const timePassed = new Label(); 					//テキストはLabelクラス
		timePassed.font = "20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		timePassed.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		timePassed.width = 400;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		timePassed.moveTo(0, 30);						//移動位置指定
		mainScene.addChild(timePassed);					//mainSceneシーンにこの画像を埋め込む

		timePassed.text = "time:" + 0;

		

		//前回の記録文字列
		const previousRecord = new Label(); 					//テキストはLabelクラス
		previousRecord.font = "20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		previousRecord.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		previousRecord.width = 400;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		previousRecord.moveTo(200, 30);						//移動位置指定
		mainScene.addChild(previousRecord);					//mainSceneシーンにこの画像を埋め込む

		previousRecord.text = "";
		
		//終了ボタン
		const finishBtn = new Sprite(100,80);
		finishBtn.moveTo(300, 420);
		finishBtn.image = game.assets[finishBtnImgUrl];
		mainScene.addChild(finishBtn);


		function endpage(){
			game.popScene();
			game.pushScene(endScene);
			gameOverText.text = "結果: ";
			for(let i = 0; i < timeRequired.length; i++){
				gameOverText.text += (timeRequired[i] + "   ");
			}
		}

		


		centerImg.ontouchend = function () {
			if(!started){
				started = true;
				startTime = Date.now();
			}
		};

		targetImg.ontouchend = function () {
			if(started){
				started = false;
				timeRequired.push([positions[state][0], positions[state][1] ,Date.now() - startTime]);

				state += 1;
				if(state >= positions.length){
					endpage();
				}
				targetImg.x = center_posi_x + positions[state][0] * Math.cos(positions[state][1] * Math.PI / 180);
				targetImg.y = center_posi_y - positions[state][0] * Math.sin(positions[state][1] * Math.PI / 180);
				
			}
			
		};

		finishBtn.ontouchend = function () {
			endpage();
		}

		



		///////////////////////////////////////////////////
		//メインループ
		game.onenterframe = function () {
			
			//前回の記録
			if(timeRequired.length == 0){
				previousRecord.text = "";
			}else{
				previousRecord.text = "前回の記録: " + timeRequired[timeRequired.length - 1][2];
			}

			//時間表示
			if(started){
				timePassed.text = "time: " + (Date.now() - startTime);
			}else{
				timePassed.text = "time: " + 0;
			}
		};



		////////////////////////////////////////////////////////////////
		//結果画面
		const endScene = new Scene();
		endScene.backgroundColor = "blue";

		//GAMEOVER
		const gameOverText = new Label(); 					//テキストはLabelクラス
		gameOverText.font = "20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		gameOverText.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		gameOverText.width = 400;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		gameOverText.moveTo(0, 30);						//移動位置指定
		endScene.addChild(gameOverText);						//endSceneシーンにこの画像を埋め込む
		



		//リトライボタン
		const retryBtn = new Sprite(120, 60);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		retryBtn.moveTo(50, 300);						//リトライボタンの位置
		retryBtn.image = game.assets[retryImgUrl];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		endScene.addChild(retryBtn);					//endSceneにこのリトライボタン画像を貼り付ける  

		retryBtn.ontouchend = function () {				//S_Retryボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			state = 0;
			game.popScene();						//endSceneシーンを外す
			game.pushScene(mainScene);					//mainSceneシーンを入れる
			targetImg.x = center_posi_x + positions[state][0] * Math.cos(positions[state][1] * Math.PI / 180);
			targetImg.y = center_posi_y - positions[state][0] * Math.sin(positions[state][1] * Math.PI / 180);
		};

		

		//tweetBtn.ontouchend = function () {				//S_Tweetボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			//ツイートＡＰＩに送信
			//結果ツイート時にURLを貼るため、このゲームのURLをここに記入してURLがツイート画面に反映されるようにエンコードする
			//const url = encodeURI("https://hothukurou.com");
			//window.open("http://twitter.com/intent/tweet?text=頑張って" + point + "枚入手した&hashtags=ahoge&url=" + url); //ハッシュタグにahogeタグ付くようにした。
	//	};

	};
	game.start();
};