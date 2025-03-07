import './NextButton.css'

// Sounds
import soundManager from '../logic/soundManager.js';
import click from '../assets/sounds/click.mp3';

const NextButton = ( { onClick } ) => {

    soundManager.loadSound('click', click);
    function playClick() {
        soundManager.playSound('click');
    }

    return (
        <>
            <div
                className="next-button"
                onClick={onClick} 
                onMouseEnter={playClick} 
                tabIndex="0"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        onClick(e);
                    }
                }}>Next</div>
        </> 
    );
}


export default NextButton;