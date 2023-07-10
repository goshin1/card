import { createSlice } from "@reduxjs/toolkit";

export const cardSlice = createSlice({
    name : 'card',
    initialState : {
        cardDeck :[
            [],
            [],
            [],
            [],
        ],
        storage : [

        ],
        deck : [

        ],
        cardImage : [
            ['PNG-cards-1.2/2_of_clubs.png', '2', 'clubs'],
            ['PNG-cards-1.2/2_of_diamonds.png', '2', 'diamonds'],
            ['PNG-cards-1.2/2_of_hearts.png', '2', 'hearts'],
            ['PNG-cards-1.2/2_of_spades.png', '2', 'spades'],
            ['PNG-cards-1.2/3_of_clubs.png', '3', 'clubs'],
            ['PNG-cards-1.2/3_of_diamonds.png', '3', 'diamonds'],
            ['PNG-cards-1.2/3_of_hearts.png', '3', 'hearts'],
            ['PNG-cards-1.2/3_of_spades.png', '3', 'spades'],
            ['PNG-cards-1.2/4_of_clubs.png', '4', 'clubs'],
            ['PNG-cards-1.2/4_of_diamonds.png', '4', 'diamonds'],
            ['PNG-cards-1.2/4_of_hearts.png', '4', 'hearts'],
            ['PNG-cards-1.2/4_of_spades.png', '4', 'spades'],
            ['PNG-cards-1.2/5_of_clubs.png', '5', 'clubs'],
            ['PNG-cards-1.2/5_of_diamonds.png', '5', 'diamonds'],
            ['PNG-cards-1.2/5_of_hearts.png', '5', 'hearts'],
            ['PNG-cards-1.2/5_of_spades.png', '5', 'spades'],
            ['PNG-cards-1.2/ace_of_clubs.png', '1', 'clubs'],
            ['PNG-cards-1.2/ace_of_diamonds.png', '1', 'diamonds'],
            ['PNG-cards-1.2/ace_of_hearts.png', '1', 'hearts'],
            ['PNG-cards-1.2/ace_of_spades.png', '1', 'spades'],
            ['PNG-cards-1.2/black_of_joker.png', '*', 'joker'],
            ['PNG-cards-1.2/jack_of_clubs2.png', 'j', 'clubs'],
            ['PNG-cards-1.2/jack_of_diamonds2.png', 'j', 'diamonds'],
            ['PNG-cards-1.2/jack_of_hearts2.png', 'j', 'hearts'],
            ['PNG-cards-1.2/jack_of_spades2.png', 'j', 'spades'],
            ['PNG-cards-1.2/king_of_clubs2.png', 'k', 'clubs'],
            ['PNG-cards-1.2/king_of_diamonds2.png', 'k', 'diamonds'],
            ['PNG-cards-1.2/king_of_hearts2.png', 'k', 'hearts'],
            ['PNG-cards-1.2/king_of_spades2.png', 'k', 'spades'],
            ['PNG-cards-1.2/queen_of_clubs2.png', 'q', 'clubs'],
            ['PNG-cards-1.2/queen_of_diamonds2.png', 'q', 'diamonds'],
            ['PNG-cards-1.2/queen_of_hearts2.png', 'q', 'hearts'],
            ['PNG-cards-1.2/queen_of_spades2.png', 'q', 'spades'],
            ['PNG-cards-1.2/red_of_joker.png', '*', 'joker'],
        ],
        monsterData : [
            {
                "img" : "../imgs/monster/test/passer.png",
                "stamina" : 30,
                "limitTurn" : 30
            }
        ]
    },
    reducers : {
        initCard : (state, action) =>{
            let temp = [];
            for(let i = 0; i < state.cardImage.length; i++){
                temp.push(
                    <div className="trump" key={`card${i}`} id={state.cardImage[i][1] + '|' + state.cardImage[i][2]}
                        draggable='true' style={{backgroundImage : `url(${state.cardImage[i][0]})`}}
                        name={state.cardImage[i][1] + '|' + state.cardImage[i][2]}>
        
                    </div>
                )
            }
            state.deck = [ ...temp ];
        },
        addCard : (state, action) => {
            let add = action.payload;
            let temp = [...state.cardDeck]
            if(add.position !== 4){
                temp[add.position].push([add.img, add.value])
                state.cardDeck = temp;
            }else{
                state.storage = [ ...state.storage, [add.img, add.value] ]
            }
        },
        deleteCard : (state, action) => {
            let del = action.payload;
            let temp = [...state.cardDeck];
            temp[del.position] = temp[del.position].filter(card => card[1] !== del.value)
            state.cardDeck = temp;
        },
        setCardDeck : (state, action) => {
            console.log(action.payload)
            state.cardDeck = action.payload;
        },
        setPositionCardDeck : (state, action) => {
            let modify = action.payload
            let temp = [ ...state.cardDeck ];
            temp[modify.position] = modify.deck;
            state.cardDeck = temp;
        },
        addStorage : (state, action) => {
            state.storage = [ ...state.storage, ...action.payload ];
        },
        clearStorage : (state, action) => {
            state.storage.length = 0;
            state.storage = [];
        },
        shuffleDeck : (state, action) => {
            for(let i = 0; i < 4; i++){
                state.cardDeck[i].sort(() => Math.random() - 0.5);
            }
            state.cardDeck = [ ...state.cardDeck ]
        },
        positionDrop : (state, action) => {
            state.storage = [ ...state.storage, ...state.cardDeck[action.payload]];
            state.cardDeck[action.payload] = [];
        },
        startGame : (state, action) =>{ 
            state.storage = [];
            state.deck = [];
            state.cardDeck = [[], [], [], []];
        }

    }
})

export default cardSlice.reducer;
export const {addCard} = cardSlice.actions;
export const {deleteCard} = cardSlice.actions;
export const {setCardDeck} = cardSlice.actions;
export const {setPositionCardDeck} = cardSlice.actions;
export const {addStorage} = cardSlice.actions;
export const {clearStorage} = cardSlice.actions;
export const {shuffleDeck} = cardSlice.actions;
export const {initCard} = cardSlice.actions;
export const {positionDrop} = cardSlice.actions;
export const {startGame} = cardSlice.actions;