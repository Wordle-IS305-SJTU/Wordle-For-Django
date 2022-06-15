document.addEventListener("DOMContentLoaded",()=>{
    createSquares();
    let guessedWords=[[]];
    let availableSpace=1;
    var word;
    $(document).ready(function(){
        getWord();
    })
    let guessedWordCount=0;
    keys=document.querySelectorAll(".keyboard-row button");
    var spell_flag = 0
    var result = [];
    // var final;

    // 从数据库取词
    function getWord(){
        $.ajax({
            url:"/api/word_get",
            type:"post",
            contentType: 'application/json;charset=UTF-8',
            success:function(res){
                word = res
                return;
            },
            error:function(){
                window.alert("ajax word_get error!")
            }
        })
    }

    // 计算得分
    // 绿方块：'&#129001'
    // 黄方块：'&#129000'
    // 黑方块：'&#11035'
    function calculatePoint(color){
        var tmp = -1; // default
        if(color == "grey"){
            // 灰色错误
            tmp = 0;
        }
        else if(color == "rgb(83,141,78)"){
            // 绿色正确
            tmp = 1;
        }
        else if(color == "rgb(181,159,59)"){
            // 黄色不完全正确
            tmp = 2;
        }
        result.push(tmp)
        console.log(result)
    }

    // 获取结果
    function getResult(){
        $.ajax({
            url:"/api/result",
            type:"post",
            contentType: 'application/json;charset=UTF-8',
            success:function(res){
                console.log("------SJTU Wordle Challenge------")
                for(i = 0; i < guessedWordCount; ++i){
                    var tmp = 'test' + String(i)
                    console.log(textProducer(res[i]))
                    console.log(tmp);
                    console.log(guessedWordCount)
                    // final = textProducer(res[i])
                    document.getElementById(tmp).innerHTML=textProducer(res[i])
                }
                return;
            },
            error:function(){
                window.alert("ajax result_get error!")
            }
        })
    }

    function sendPoint(){
        $.ajax({
            url:"/api/point",
            type:"get",
            data:{"result":result.join(''), "row":guessedWordCount},
            contentType: 'application/json;charset=UTF-8',
            success:function(){
                console.log("send point success")
                return;
            },
            error:function(){
                window.alert("ajax send_point error")
            }
        })
    }

    // 生成文本
    function textProducer(res){
        tmp = ''
        for(j=0;j<5;++j){
            if(res[j] == 1){
                tmp = tmp + '&#129001 '
            }
            else if (res[j] == 2){
                tmp = tmp + '&#129000 '
            }
            else if (res[j] == 0){
                tmp = tmp + '&#11035 '
            }
        }
        return tmp;
    }

    // 获取当前输入的单词
    function getCurrentWordArr(){
        numberOfGuessedWords = guessedWords.length
        return guessedWords[numberOfGuessedWords - 1]
    }

    // 填入字母
    function updateGuessedWords(letter){
        currentWordArr=getCurrentWordArr()
        if (currentWordArr && currentWordArr.length < 5){
            currentWordArr.push(letter);
            availableSpaceEl=document.getElementById(String(availableSpace));
            availableSpace=availableSpace+1;
            availableSpaceEl.textContent=letter;
        }
    }
    
    // 赋颜色
    function getTileColor(letter,index){
        isCorrectLetter=word.includes(letter);
        if(!isCorrectLetter){
            return "grey";
        }
        letterInThatPosition=word.charAt(index);
        isCorrectPosition=(letter===letterInThatPosition);
    
        if (isCorrectPosition){
            return "rgb(83,141,78)";
        }
    
        return "rgb(181,159,59)";
    }

    // 回车后的处理
    function handleSubmitWord(){
        result = []
        currentWordArr=getCurrentWordArr();
        currentWord=currentWordArr.join('');
        firstLetterId=guessedWordCount*5+1;
        interval=200;
        currentWordArr.forEach((letter,index)=>{
        setTimeout(()=>{
            const tileColor=getTileColor(letter,index);
            letterId=firstLetterId+index;
            letterEl=document.getElementById(letterId);
            letterEl.classList.add("animate__flipInX");
            letterEl.style='background-color:'+tileColor+';border-color:'+tileColor+'';
            },interval*index)
            calculatePoint(getTileColor(letter,index)) 
        });
        sendPoint()

    
        guessedWordCount+=1;
        if (currentWord===word){
            cuteAlert({
                type: "success",
                title: "Congratulations!",
                message: "You win this one! Excellent! Here's your results. Copy and share it with your friends!",
                buttonText: "OK!!!",
            })
            getResult()
        }
        else if (guessedWords.length>=6){
            cuteAlert({
                type: "error",
                title: "You failed...",
                message: "You have used up your six chances. The correct word is "+word+".",
                buttonText: "OK:-(",
            })
            getResult()
        }
        guessedWords.push([])
    }

    // 创建填词的方格
    function createSquares() {
        gameboard=document.getElementById("board");
        
        for(let index=0;index<30;index++)
        {
        square=document.createElement("div");
        square.classList.add("square");
        square.classList.add("animate_animated");
        square.setAttribute("id",index+1);
        gameboard.appendChild(square);
        }
    }
    
    // Delete
    function handleDeleteLetter(){
        currentWordArr=getCurrentWordArr();
        removedLetter=currentWordArr.pop();
        guessedWords[guessedWords.length-1]=currentWordArr;
        LastLetterEl=document.getElementById(String(availableSpace-1));
        LastLetterEl.textContent='';
        availableSpace=availableSpace-1;
    }

    // 检查单词拼写
    function wordCheck(){
        $.ajax({
            url:"/api/word_check",
            type:"get",
            data:{"word":getCurrentWordArr().join('')},
            contentType: 'application/json;charset=UTF-8',
            success:function(res){
                console.log(res)
                spell_flag = res
                if(spell_flag == 0){
                    cuteAlert({
                        type: "warning",
                        title: "Wrong Spell",
                        message: "Your spelling is wrong!",
                        buttonText: "Cancel",
                    })
                    handleDeleteLetter()
                    handleDeleteLetter()
                    handleDeleteLetter()
                    handleDeleteLetter()
                    handleDeleteLetter()
                    return;
                }
                else if(spell_flag == 1){
                    handleSubmitWord()
                    return;
                }
            },
            error:function(){
                window.alert("ajax word_check error")
            }
        })
         
    }
    

    for (let i=0;i< keys.length;i++){
        keys[i].onclick=({target})=>{
        letter= target.getAttribute("data-key");
    if (letter==="enter"){
        currentWordArr=getCurrentWordArr()
        if (currentWordArr.length!==5){
            cuteAlert({
                type: "warning",
                title: "Wrong Spell",
                message: "It must be a 5-letter-word!",
                buttonText: "Cancel",
            })
            return;
        }
        else{
            wordCheck()
        }
    }
    if (letter==="del"){
        handleDeleteLetter()
        return;
    }
    
    updateGuessedWords(letter)
    }
    }
    }
    )

