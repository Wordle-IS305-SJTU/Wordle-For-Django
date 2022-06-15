
document.addEventListener("DOMContentLoaded",()=>{
    createSquares();
    let guessedWords=[[]];
    let availableSpace=1;
    /*let word=wordle[Math.floor(Math.random()*wordle.length)]; */
    var word;
    $(document).ready(function(){
        getWord();
    })
    let guessedWordCount=0;
    keys=document.querySelectorAll(".keyboard-row button");
    var spell_flag = 0
    
    // 从数据库取词
    function getWord(){
        $.ajax({
            url:"/word_get",
            type:"post",
            contentType: 'application/json;charset=UTF-8',
            success:function(res){
                word = res
                return;
            },
            error:function(){
                window.alert("get word error!")
            }
        })
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
        });
    
        guessedWordCount+=1;
        if (currentWord===word){
            window.alert("Congratulation")
        }
        if (guessedWords.length===6){
            window.alert('sorry,you have no more guesses! The word is '+word+'.')
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
            url:"/word_check",
            type:"get",
            data:{"word":getCurrentWordArr().join('')},
            contentType: 'application/json;charset=UTF-8',
            success:function(res){
                console.log(res)
                spell_flag = res
                if(spell_flag == 0){
                    window.alert("wrong spell")
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
                window.alert("ajax error")
            }
        })
         
    }
    

    for (let i=0;i< keys.length;i++){
        keys[i].onclick=({target})=>{
        letter= target.getAttribute("data-key");
    if (letter==="enter"){
        currentWordArr=getCurrentWordArr()
        if (currentWordArr.length!==5){
            window.alert("word must be 5 letters");
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

