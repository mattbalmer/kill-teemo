(function (window) {
    'use strict';
    
    var stage
        , teemos = []
        , background
        , score = 0
        , state = null
        , teemoCountText = new createjs.Text('Teemos: ', '20px Arial', '#dda582')
        , stageWidth = 800
        , stageHeight = 600
        , teemoWidth = 250
        , teemoHeight = 190
        , teemoTickTime = 500;

    function initialize() {
        stage = new createjs.Stage('KillTeemoCanvas');
        background = new createjs.Shape();
        var hit = new createjs.Shape();
        hit.graphics.beginFill("#000").rect(0, 0, stageWidth, stageHeight);
        background.hitArea = hit;

        stage.addChild( background );
        stage.update();

        intro();
    }

    function intro() {
        state = 'INTRO';

        var introText = new createjs.Text('Right-Click Teemo to kill him', '38px Arial', '#dda582');
        introText.x = stageWidth / 2;
        introText.y = stageHeight / 2;
        introText.textAlign = 'center';
        introText.textBaseline = 'middle';

        var textShadow = new createjs.Shadow("#000000", 1, 1, 3);
        introText.shadow = textShadow;
        stage.addChild(introText);

        var teemo = makeTeemo(380, 350);
        stage.addChild( teemo );

        stage.update();

        teemo.addEventListener('click', function(event) {
            var isRightClick = event.nativeEvent.button == 2;

            if( isRightClick ) {
                stage.removeChild(introText);
                stage.removeChild(textShadow);
                stage.removeChild(teemo);
                start();
            }

            event.stopImmediatePropagation();
            return false;
        });
    }

    function start() {
        state = 'PLAYING';

        teemoCountText = new createjs.Text('Teemos: ', '20px Arial', '#dda582');
        teemos = [];

        teemoCountText.x = 10;
        teemoCountText.y = 10;
        var textShadow = new createjs.Shadow("#000000", 1, 1, 3);
        teemoCountText.shadow = textShadow;

        stage.addChild( teemoCountText );

        background.addEventListener('click', onStageClick);

        setTimeout(addTeemo, teemoTickTime);
        updateStage();
        createjs.Ticker.addEventListener('tick', stage);
    }

    function makeTeemo(x, y) {
        var scale = .5;
        var scaleVariance = .1;

        var teemo = new createjs.Bitmap('img/teemo.png');
        var bmpScale = scale + (Math.random() * (scaleVariance * 2) - scaleVariance);
        teemo.scaleX = bmpScale;
        teemo.scaleY = bmpScale;
        teemo.regX = teemoWidth * bmpScale * .5;
        teemo.regY = teemoHeight * bmpScale * .5;
        var marginX = teemo.regX + 10,
            marginY = teemo.regY + 10;

        teemo.x = x || (Math.random() * (stageWidth - marginX * 2) + teemo.regX - 10);
        teemo.y = y || (Math.random() * (stageHeight - marginY * 2) + teemo.regY - 10);

        return teemo;
    }

    function fadeInTeemo(teemo) {
        teemo.alpha = 0;
        teemo.scaleX *= .8;
        teemo.scaleY *= .8;
        createjs.Tween.get(teemo)
            .wait(0)
            .to({
                alpha: 1,
                scaleX: teemo.scaleX * 1.3,
                scaleY: teemo.scaleY * 1.3
            }, 300)
            .call(function() {
                createjs.Tween.get(teemo)
                    .wait(0)
                    .to({
                        scaleX: teemo.scaleX / 1.04,
                        scaleY: teemo.scaleY / 1.04
                    }, 300);
            });
    }

    function removeTeemo(teemo) {
        stage.removeChild( teemo );
        teemos.splice( teemos.indexOf(teemo), 1 );
        updateStage();
    }

    function addTeemo() {
        if(teemos.length > 2 || state != 'PLAYING') return;

        var teemo = makeTeemo();

        fadeInTeemo(teemo);

        teemo.addEventListener('click', onTeemoClick);

        stage.addChild( teemo );
        teemos.push(teemo);
        updateStage();

        if(teemos.length < 3)
            setTimeout(addTeemo, teemoTickTime);
    }

    function onTeemoClick(event) {
        var isRightClick = event.nativeEvent.button == 2;

        if( isRightClick ) {
            score++;
            removeTeemo(event.currentTarget);

            if(teemos.length < 3) {
                setTimeout(addTeemo, teemoTickTime);
            }
        }

        event.stopImmediatePropagation();
        return false;
    }

    function updateStage() {
        teemoCountText.text = 'Teemos Killed: ' + score;

        stage.update();
    }

    function onStageClick(event) {
        var isRightClick = event.nativeEvent.button == 2;

        if(isRightClick) gameOver();
    }

    function gameOver() {
        if(state == 'OVER') return;

        state = 'OVER';
        var gameOverText = new createjs.Text('You missed. \nTeemo will now rule the world. gg', '38px Arial', '#dda582');
        gameOverText.x = stageWidth / 2;
        gameOverText.y = stageHeight / 2;
        gameOverText.textAlign = 'center';
        gameOverText.textBaseline = 'middle';

        var textShadow = new createjs.Shadow("#000000", 1, 1, 3);
        gameOverText.shadow = textShadow;
        stage.addChild(gameOverText);

        var restartText = new createjs.Text('Left-Click to restart', '24px Arial', '#dda582');
        restartText.x = stageWidth / 2;
        restartText.y = stageHeight - 75;
        restartText.textAlign = 'center';
        restartText.textBaseline = 'middle';

        var restartTextShadow = new createjs.Shadow("#000000", 1, 1, 3);
        restartText.shadow = restartTextShadow;
        stage.addChild(restartText);

        for(var i = 0; i < teemos.length; i++) {
            stage.removeChild( teemos[i] );
            updateStage();
        }
        teemos = [];

        stage.update();

        function restart(event) {
            console.log(event.nativeEvent.button);
            var isLeftClick = event.nativeEvent.button == 0;
            if(!isLeftClick) return;

            stage.removeChild(gameOverText);
            stage.removeChild(restartText);
            stage.removeChild(teemoCountText);
            background.removeEventListener('click', restart);
            score = 0;
            updateStage();
            start();
        }

        background.removeEventListener('click', onStageClick);
        background.addEventListener('click', restart);
    }

    window.init = function() {
        setTimeout(initialize, 5);
    }
}(window));