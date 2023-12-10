import './play.css'
import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addCard, deleteCard, setPositionCardDeck,
        addStorage, clearStorage, shuffleDeck, initCard, positionDrop } from "../cardSlice";
import { useLocation, useNavigate } from 'react-router-dom';
import uuid from 'react-uuid'
import axios from 'axios';

export default function ReactHome(){
    const dispatch = useDispatch();

    const cardDeck = useSelector(state => state.card.cardDeck);
    const cardImage = useSelector(state => state.card.cardImage);
    
    const storage = useSelector(state => state.card.storage);
    const monsterData = useSelector(state => state.card.monsterData);
    const [draw, setDraw] = useState(0);
    const [stage, setStage] = useState(0);
    const [score, setScore] = useState(0);
    const [turn, setTurn] = useState(0);
    const [drops, setDrops] = useState([]);


    const location = useLocation();
    const navigate = useNavigate();
    const profile = location.state.profile;
    

    const [dragged, setDragged] = useState()
    const [parent, setParent] = useState();


    const useInterval = (callback, delay) => {
        const savedCallback = useRef(); 

        useEffect(() => {
            savedCallback.current = callback; 
        }, [callback]);

        useEffect(() => {
            function tick() {
                savedCallback.current(); 
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id); 
            }
        }, [delay]);
    }
    const [time, setTime] = useState(0);
    useInterval(()=>{
        setTime(time + 1);
    }, monsterData.length > stage ? 1000 : null)

    if(time > 30){
        setTime(0)
        setDraw(0)
        setTurn(turn + 1);
    }

    document.addEventListener('drag', event=>{
        
    })

    document.addEventListener('dragstart', event=>{
        setDragged(event.target)
        setParent(event.target.parentNode)
        event.target.classList.add('dragging');
    })

    document.addEventListener('dragend', event => {
        event.target.classList.remove('dragging')
    })

    document.addEventListener('dragover', event => {
        event.preventDefault();
    }, false)

    document.addEventListener('dragenter', event=>{
        if (event.target.classList.contains("dropcard")) {
            event.target.classList.add("dragover");
        }
    })

    document.addEventListener('dragleave', event => {
        if (event.target.classList.contains("dropcard")) {
            event.target.classList.remove("dragover");
        }
    })

    
    const cardCheck = () => {
        let straight = '12345jqk|kqj54321';
        for(let a = 0; a < 4; a++){
            if(cardDeck[a].length >= 5){
                let best = 0;
                let bestP = 0;
                for(let i = 0; i < cardDeck[a].length - 4; i++){
                    let num = '';
                    let type = '';
                    let before = '';
                    let joker = false;
                    cardDeck[a].slice(i, i + 5).map((element) => {
                        let temp = element[1].split('|')
                        if(temp[0] === '*'){
                            temp[0] = straight[straight.indexOf(before) + 1]
                            joker = true;
                        }
                        num += temp[0]
                        type += temp[1]+','
                        before = temp[0];
                    })
                    type = new Set(type.slice(0, type.length - 1).split(','))
                    let nums = num.split('')
                    nums.sort()
                    nums = new Set(nums)
                    let temp = new Set(num.split(''))
                    if((type.size === 1 || (type.size === 2 && type.has('*')) || (nums.size === 2 && joker)) && best <= 1){
                        best = 1
                        bestP = i;
                    } if(straight.includes(num) && best <= 2){
                        best = 2
                        bestP = i;
                    } if(straight.includes(num) && (type.size === 1 || (type.size === 2 && type.has('*'))) && best <= 3){
                        best = 3
                        bestP = i;
                    } if(num.includes('1') && num.includes('2') && joker && temp.size === 2 && best <= 6) {
                        best = 10
                        bestP = i;
                    }
                }
                console.log(`${a+1}최대 점수 : `+best)
                console.log(`${a+1}최대 점수의 위치 : `+bestP)
                if(best > 0){
                    let modify = [ ...cardDeck[a] ];
                    let save = [];
                    for(let i = bestP; i < bestP + 5; i++){
                        modify = [ ...modify.filter(element => element[1] !== cardDeck[a][i][1])];
                        save.push(cardDeck[a][i])
                    }
                    dispatch(addStorage(save));
                    if(best > 0){
                        document.getElementById('monster').click();
                    }
                    dispatch(setPositionCardDeck({position : a, deck : modify}));
                    console.log("before : "+stamina)
                    setStamina(stamina - (best * staminaStep))
                    console.log("after : "+stamina+"/"+(best * staminaStep))
                    setScore(score + best);
                    if(best !== 0){
                        document.getElementById('monster').click()
                    }
                    setTime(0);
                    // setTimeout 함수 써서 attack변수를 1초간 true로 구현해 볼 것
                }
                
                
                

            }
        }
    }  

    


    let trumps = [[],[],[],[]];
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < cardDeck[i].length; j++){
            trumps[i].push(
                <div className="trump" key={uuid()} id={cardDeck[i][j][1]}
                    draggable='true' style={{backgroundImage : `${cardDeck[i][j][0]}`}}
                    name={cardDeck[i][j][1]}>

                </div>
            )
        }
    }

    let saves = [];
    for(let i = 0; i < storage.length; i++){
        saves.push(
            <div className="trump" key={uuid()} id={storage[i][1]}
                    draggable='false' style={{backgroundImage : `${storage[i][0]}`}}
                    name={storage[i][1]}>

            </div>
        );
    }
    let positionD = {
        firstP : 0,
        secondP : 1,
        threeP : 2,
        fourP : 3
    }

    useDispatch(initCard());
    let temp = [];
    if(temp.length === 0){
        for(let i = 0; i < cardImage.length; i++){
            temp.push(
                <div className="trump" key={`card${i}`} id={cardImage[i][1] + '|' + cardImage[i][2]}
                    draggable='true' style={{backgroundImage : `url(${cardImage[i][0]})`}}
                    name={cardImage[i][1] + '|' + cardImage[i][2]}>
    
                </div>
            )
        }
        temp.sort(() => Math.random() - 0.5)
    }
    

    const [cards, setCards] = useState([ ...temp ]);
    let staminaStep = 0;
    if(monsterData.length > stage){
        if(monsterData[stage].limitTurn <= turn){
            setStage(stage + 1);
        }
        staminaStep = 134 / monsterData[stage].stamina;
    }

    const [stamina, setStamina] = useState(monsterData.length > stage ? staminaStep * monsterData[stage].stamina : 0);

    const exitGame = () => {
        /*
            profile(id, nickname, levels, score)
        */
        console.log(score)
        axios.post(`${process.env.REACT_APP_CARD_ROUTER_HOST}exit`, {
            data : {
                profile : profile,
                score : score
            }
        })
            .then((res) =>{
                if(res.data !== 'not information'){
                    navigate('/score', {
                        state : {
                            member : profile
                        }
                    })
                }
            });
    }

    return <div id="reactHome">
        <div id='stage'>
        <div key={uuid()}>
                <div id='monster' style={{backgroundImage :  monsterData.length > stage && stamina > 0 ? `url(${monsterData[stage].img})` : '', display : monsterData.length > stage && stamina > 0 ? 'block' : 'none'}} 
                onClick={(event)=>{
                    if(stamina > 0){
                        setTimeout(()=>{
                            document.getElementById('monster').style.backgroundImage = 'url(../imgs/monster/test/passerWalk1.png)';
                        },400);
                        setTimeout(()=>{
                            document.getElementById('monster').style.backgroundImage = 'url(../imgs/monster/test/passerWalk2.png)';
                        },200);
                        setTimeout(()=>{
                            document.getElementById('monster').style.backgroundImage = 'url(../imgs/monster/test/passerWalk1.png)';
                        },400);
                        document.getElementById('monster').style.backgroundImage = 'url(../imgs/monster/test/passer.png)';
                    }
                }}></div>
                <div id='result' style={{display : monsterData.length > stage && stamina > 0 ? 'none' : 'block'}} key={uuid()}>
                    <p>{stage} 진출!</p>
                    <p>점수 : {score}</p>
                    <input type='button' value='' onClick={exitGame}/>
                </div>
                <div id='statusBar'style={{display : monsterData.length > stage && stamina > 0 ? 'block' : 'none'}}>
                    <p>짹짹이</p>
                    <p id='stamina' style={{width : `${stamina}px`, marginLeft : '10px'}}></p>
                    <br/>
                    <p id='subscribe'>
                        <span>드로우 {draw}</span>
                        <span>{turn} 턴</span>
                    </p>
                </div>
            </div>
        </div>
        <div id='timeBox'>
            <div id='timeBar' style={ {marginLeft : `${0 - (time * 3.4) * 7.36}px`}}></div>
        </div>
        <div id='cardHome'>
            <div id='cardBtns'>
                <div id='turnBtn' onClick={()=>{
                    if(draw >= 5){
                        setDraw(0);
                        setTime(0);
                        cardCheck();
                        setTurn(turn + 1);
                    }
                }}></div>
                <div id='supplyBtn' onClick={()=>{
                    if(storage.length > 0 && (draw === 0 || draw === 5) ){
                        let supplyTemp = [];
                        for(let i = 0; i < storage.length; i++){
                            supplyTemp.push(
                                <div className="trump" key={uuid()} id={storage[i][1]}
                                        draggable='true' style={{backgroundImage : `${storage[i][0]}`}}
                                        name={storage[i][1]}>
    
                                </div>
                            )    
                        }
                        setCards([ ...cards, ...supplyTemp]);
                        dispatch(clearStorage())
                        console.log(storage)
                    }
                }}></div>
                <div id='shuffleBtn' onClick={()=>{
                    if(draw < 5){
                        if((trumps[0].length > 0) || (trumps[1].length > 0) || (trumps[2].length > 0) || (trumps[3].length > 0)){
                            dispatch(shuffleDeck());
                            setDraw(draw + 1);
                        }
                    }
                }}></div>
                <div className="dropcard" id='trashPosition' onDrop={(event) => {
                    event.preventDefault();
                    let parentId = parent.getAttribute('id');
                    if (event.target.classList.contains("dropcard") && draw < 5) {
                        event.target.classList.remove("dragover")
                        if(parentId === null){
                            setCards(cards.filter(e => e.props.id !== dragged.id))
                        }
                        
                        if(parentId !== null){
                            dispatch(deleteCard({position : positionD[parentId], value : dragged.getAttribute('name')}));
                        }
                        dispatch(addCard({position : 4, value :dragged.getAttribute('name'), img : `${dragged.style.backgroundImage}`}));
                        setDraw(draw + 1);
                    }
                    setDragged(null);
                    setParent(null);
                }}></div>
            </div>
            <div className="dropcard cardPosition" id='firstP' onDrop={(event)=>{
                event.preventDefault();
                if(trumps[0].length >= 10){
                    return
                }

                let parentId = parent.getAttribute('id');
                if (event.target.classList.contains("dropcard") && draw < 5) {
                    event.target.classList.remove("dragover")
                    if(parentId === null){
                        setCards(cards.filter(e => e.props.id !== dragged.id))
                    }
                    
                    if(parentId !== null){
                        dispatch(deleteCard({position : positionD[parentId], value : dragged.getAttribute('name')}));
                    }
                    dispatch(addCard({position : 0, value :dragged.getAttribute('name'), img : `${dragged.style.backgroundImage}`}));
                    setDraw(draw + 1);
                }
            }}>
                <button className='dropDelete' onClick={() => {
                    if(draw < 5){
                        dispatch(positionDrop(0));
                        setDraw(5);
                    }
                }}></button>
                {trumps[0]}
            </div>
            <div className="dropcard cardPosition" id='secondP' onDrop={(event)=>{
                event.preventDefault();
                if(trumps[1].length >= 10){
                    return
                }
                let parentId = parent.getAttribute('id');
                if (event.target.classList.contains("dropcard") && draw < 5) {
                    event.target.classList.remove("dragover")
                    if(parentId === null){
                        setCards(cards.filter(e => e.props.id !== dragged.id))
                    }
                    if(parentId !== null){
                        dispatch(deleteCard({position : positionD[parent], value :dragged.getAttribute('name')}));
                    }
                    dispatch(addCard({position : 1, value :dragged.getAttribute('name'), img : `${dragged.style.backgroundImage}`}));
                    setDraw(draw + 1);
                }
            }}>
                <button className='dropDelete' onClick={() => {
                    if(draw < 5){
                        dispatch(positionDrop(1));
                        setDraw(5);
                    }
                }}></button>
                {trumps[1]}
            </div>
            <div className="dropcard cardPosition" id='threeP' onDrop={(event)=>{
                event.preventDefault();
                if(trumps[2].length >= 10){
                    return
                }
                let parentId = parent.getAttribute('id');
                if (event.target.classList.contains("dropcard") && draw < 5) {
                    event.target.classList.remove("dragover")
                    if(parentId === null){
                        setCards(cards.filter(e => e.props.id !== dragged.id))
                    }
                    if(parentId !== null){
                        dispatch(deleteCard({position : positionD[parent], value :dragged.getAttribute('name')}));
                    }
                    dispatch(addCard({position : 2, value :dragged.getAttribute('name'), img : `${dragged.style.backgroundImage}`}));
                    setDraw(draw + 1);
                }
            }}>
                <button className='dropDelete' onClick={() => {
                    if(draw < 5){
                        dispatch(positionDrop(2));
                        setDraw(5);
                    }
                }}></button>
                {trumps[2]}
            </div>
            <div className="dropcard cardPosition" id='fourP' onDrop={(event)=>{
                event.preventDefault();
                if(trumps[3].length >= 10 || draw > 5){
                    return
                }
                let parentId = parent.getAttribute('id');
                if (event.target.classList.contains("dropcard") && draw < 5) {
                    event.target.classList.remove("dragover")
                    if(parentId === null){
                        setCards(cards.filter(e => e.props.id !== dragged.id))
                    }
                    if(parentId !== null){
                        dispatch(deleteCard({position : positionD[parent], value :dragged.getAttribute('name')}));
                    }
                    dispatch(addCard({position : 3, value :dragged.getAttribute('name'), img : `${dragged.style.backgroundImage}`}));
                    setDraw(draw + 1);
                }
            }}>
                <button className='dropDelete' onClick={() => {
                    if(draw < 5){
                        dispatch(positionDrop(3));
                        setDraw(5);
                    }
                }}></button>
                {[...trumps[3]]}
            </div>

            <div id='cards'>
                <div className="dropcard deck">
                    {cards}
                </div>
                <div className='dropcard storage' draggable='false'>
                    {saves}
                </div>
            </div>
        </div>

    </div>
}