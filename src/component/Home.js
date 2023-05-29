import './home.css'

export default function Home(){

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
    })

    document.addEventListener('dragenter', event=>{
        if (event.target.classList.contains("dropzone")) {
            event.target.classList.add("dragover");
        }
    })

    document.addEventListener('dragleave', event => {
        if (event.target.classList.contains("dropzone")) {
            event.target.classList.remove("dragover");
        }
    })

    document.addEventListener("drop", event => {
        event.preventDefault();
        if (event.target.classList.contains("dropzone")) {
            event.target.classList.remove("dragover")
            if(event.target !== dragged){
                dragged.parentNode.removeChild(dragged);
                console.log(event.target)
                event.target.appendChild(dragged);
            }
        }
    });

    return <div id="home">
        <div className="dropzone">
            <div className='card dropzone' draggable='true'>a</div>
            <div className='card dropzone' draggable='true'>b</div>
            <div className='card dropzone' draggable='true'>c</div>
            <div className='card dropzone' draggable='true'>d</div>
        </div>
        <div className="dropzone">
            
        </div>
        <div className="dropzone">
            
        </div>
        <div className="dropzone">
            
        </div>
        <div className="dropzone">
            
        </div>
    </div>
}