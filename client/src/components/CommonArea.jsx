import "./CommonArea.css";

function CommonArea({ corner, children }) {
  return (
    <div className='common-area'>
        <div className="play-spot"></div>
        <div className="play-spot"></div>
        <div className="play-spot"></div>
        <div className="play-spot"></div>
        <div className="play-spot"></div>
        <div className="play-spot"></div>
        <div className="play-spot"></div>
        <div className="play-spot"></div>
    </div>
  );
}

export default CommonArea;
