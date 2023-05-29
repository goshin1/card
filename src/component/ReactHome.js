import './reactHome.css'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addCard, deleteCard, setPositionCardDeck, addStorage } from "../cardSlice";
import uuid from 'react-uuid'

export default function ReactHome(){
    const dispatch = useDispatch();
    const cardDeck = useSelector(state => state.card.cardDeck);
    const cardImage = useSelector(state => state.card.cardImage);
    const storage = useSelector(state => state.card.storage);
    const [draw, setDraw] = useState(0);
    const [score, setScore] = useState(0);
    const [firstP, setFirstP] = useState([]);
    const [secondP, setSecondP] = useState([]);
    const [threeP, setThreeP] = useState([]);
    const [fourP, setFourP] = useState([]);
    
    let dragged;

    document.addEventListener('drag', event=>{
        
    })

    document.addEventListener('dragstart', event=>{
        dragged = event.target;
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

    // 판 이미지 제작, 버튼 클릭 시 규칙 파악하기
    const cardCheck = () => {
        let straight = '12345jqk|kqj54321';
        let pArray = ['firstP', 'secondP', 'threeP', 'fourP']
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
                    let temp = new Set(num.split(''))
                    if((type.size === 1 || type.size === 2 && type.has('joker')) && best <= 1){
                        best = 1
                        bestP = i;
                    } else if(straight.includes(num) && best <= 2){
                        best = 2
                        bestP = i;
                    } else if(straight.includes(num) && type.length === 1  && best <= 3){
                        best = 3
                        bestP = i;
                    } else if(num.includes('1') && num.includes('2') && joker && temp.size === 2 && best <= 6) {
                        best = 6
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
                    dispatch(setPositionCardDeck({position : a, deck : modify}));
                    setScore(score + bestP);
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
    // temp.sort(() => Math.random() - 0.5)

    let temp = [];
    for(let i = 0; i < cardImage.length; i++){
        temp.push(
            <div className="trump" key={uuid()} id={cardImage[i][1] + '|' + cardImage[i][2]}
                draggable='true' style={{backgroundImage : `url(${cardImage[i][0]})`}}
                name={cardImage[i][1] + '|' + cardImage[i][2]}>

            </div>
        )
    }
    const [cards, setCards] = useState([ ...temp ]);
    
    return <div id="reactHome">
        <div id='stage'>
            <div id='pointBar'>

            </div>
            <div id='monster' style={{backgroundImage : `url(../imgs/passer.png)`}}>
                
            </div>
        </div>
        <div id='cardHome'>
            <div id='cardBtns'>
                <div id='turnBtn' onClick={()=>{
                    if(draw >= 5){
                        setDraw(0);
                        cardCheck();
                    }
                }}></div>
                <div id='supplyBtn'>
                    
                </div>
            </div>
            <div className="dropcard cardPosition" id='firstP' onDrop={(event)=>{
                event.preventDefault();
                let parent = dragged.parentNode.getAttribute('id');
                if (event.target.classList.contains("dropcard") && draw < 5) {
                    event.target.classList.remove("dragover")
                    if(dragged.parentNode.id === ''){
                        setCards(cards.filter(e => e.props.id !== dragged.id))
                    }
                    setFirstP([ ...firstP, [dragged.style.backgroundImage, ...dragged.id.split('|')]])
                    if(parent !== null){
                        dispatch(deleteCard({position : positionD[parent], value : dragged.getAttribute('name')}));
                    }
                    dispatch(addCard({position : 0, value :dragged.getAttribute('name'), img : `${dragged.style.backgroundImage}`}));
                    setDraw(draw + 1);
                }
            }}>
                {trumps[0]}
            </div>
            <div className="dropcard cardPosition" id='secondP' onDrop={(event)=>{
                event.preventDefault();
                let parent = dragged.parentNode.getAttribute('id');
                if (event.target.classList.contains("dropcard") && draw < 5) {
                    event.target.classList.remove("dragover")
                    if(dragged.parentNode.id === ''){
                        setCards(cards.filter(e => e.props.id !== dragged.id))
                    }
                    setSecondP([ ...secondP, [dragged.style.backgroundImage, ...dragged.id.split('|')]])
                    if(parent !== null){
                        dispatch(deleteCard({position : positionD[parent], value :dragged.getAttribute('name')}));
                    }
                    dispatch(addCard({position : 1, value :dragged.getAttribute('name'), img : `${dragged.style.backgroundImage}`}));
                    setDraw(draw + 1);
                }
            }}>
                {trumps[1]}
            </div>
            <div className="dropcard cardPosition" id='threeP' onDrop={(event)=>{
                event.preventDefault();
                let parent = dragged.parentNode.getAttribute('id');
                if (event.target.classList.contains("dropcard") && draw < 5) {
                    event.target.classList.remove("dragover")
                    if(dragged.parentNode.id === ''){
                        setCards(cards.filter(e => e.props.id !== dragged.id))
                    }
                    setThreeP([ ...threeP, [dragged.style.backgroundImage, ...dragged.id.split('|')]])
                    if(parent !== null){
                        dispatch(deleteCard({position : positionD[parent], value :dragged.getAttribute('name')}));
                    }
                    dispatch(addCard({position : 2, value :dragged.getAttribute('name'), img : `${dragged.style.backgroundImage}`}));
                    setDraw(draw + 1);
                }
            }}>
                {trumps[2]}
            </div>
            <div className="dropcard cardPosition" id='fourP' onDrop={(event)=>{
                event.preventDefault();
                let parent = dragged.parentNode.getAttribute('id');
                if (event.target.classList.contains("dropcard") && draw < 5) {
                    event.target.classList.remove("dragover")
                    if(dragged.parentNode.id === ''){
                        setCards(cards.filter(e => e.props.id !== dragged.id))
                    }
                    setFourP([ ...fourP, [dragged.style.backgroundImage, ...dragged.id.split('|')]])
                    if(parent !== null){
                        dispatch(deleteCard({position : positionD[parent], value :dragged.getAttribute('name')}));
                    }
                    dispatch(addCard({position : 3, value :dragged.getAttribute('name'), img : `${dragged.style.backgroundImage}`}));
                    setDraw(draw + 1);
                }
            }}>
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