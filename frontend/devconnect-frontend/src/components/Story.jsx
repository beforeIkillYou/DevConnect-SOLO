import React,{useState} from 'react';
import { Link } from 'react-router-dom';


const Story = (props) => {
    const [storyElement, setStoryElement] = useState(<div></div>)

    const showStory = () => {        
        setStoryElement(
        <div className=''>
            <img src={props.story} className='h-[25rem] w-[40rem] object-fill absolute top-1/4 right-1/4 shadow-inherit drop-shadow-2xl'/>
            <h1 className='absolute top-[9rem] right-[43rem] text-xl font-mono text-center underline'>{props.username}</h1>
        </div>
        )
    }

    const removeStory = () => {
        setStoryElement(<div></div>)
    }

    return (
        <div className='mr-16'>
            <button onMouseOver={showStory} onMouseOut={removeStory}>
                <img src={props?.avatar} className='w-16 h-16 rounded-full object-cover' /> 
            </button>
            {storyElement}
        </div>
    );
}

export default Story;
