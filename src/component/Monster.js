import { styled, keyframes } from 'styled-components';
import { useSelector } from "react-redux";

export default function Monster(props){
    
    const monsterData = useSelector(state => state.card.monsterData);

    const monsterAni = keyframes`
        ${monsterData[props.stage].animation}
    `
    const monsterCss = styled.div`
        margin: 30px auto;
        width: 300px;
        height: 300px;
        background-size: 300px;
        border: 5px solid #202020;
    `;

    return <div id='monster' style={{backgroundImage : `url(${monsterData[props.stage].img})`}} onClick={(event)=>{
        setTimeout(()=>{
            document.getElementById('monster').style.animation = 'hurt 0.5s 1';
        },500)
        console.log('ss')
    }}></div>
}