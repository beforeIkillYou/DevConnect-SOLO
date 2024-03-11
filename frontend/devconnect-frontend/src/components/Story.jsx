import React,{useState} from 'react';
import { Link } from 'react-router-dom';


const Story = (props) => {
    const [storyElement, setStoryElement] = useState(<div></div>)

    const showStory = () => {
        setStoryElement(<div><img src={props.story} className='h-[30rem] w-[50rem] object-fill absolute gap-x-0 gap-y-5 '></img></div>)
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
