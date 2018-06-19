import React from 'react';
import './index.css';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			count: 0,
		}
	}

	tick = () => {
		this.setState(prevState => {
			return { 
				count: prevState.count + 1,
			}
		});
	}

	startTimer = () => {
		clearInterval(this.timer);
		this.timer = setInterval(this.tick, 1000);
	}

	stopTimer = () => {
		clearInterval(this.timer);

	}

	resetTimer = () => {
		clearInterval(this.timer);
		this.setState({ count: 0});
	}


	componentDidMount() {
		this.startTimer();
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.active !== nextProps.active) {
			if (nextProps.active) {
				this.startTimer();
			}
			else {
				this.stopTimer();
			}
		} 
	}

	componentWillUnmount() {
		this.resetTimer();
	}

	render() {
		const button = this.props.active ? 'Pause' : 'Resume';

		//Convert count to time display
		const count = this.state.count;
		let displayTime;
		let sec = count % 60;
		let min = (count - sec) / 60;
		if (count < 3600) {
			displayTime = min + ':' + sec.toString().padStart(2,'0');
		}
	    else {
	    	let hr = Math.floor(count / 3600);
	        min -= hr * 60;
	        displayTime = hr + ':' + min.toString().padStart(2,'0') + ':' + sec.toString().padStart(2,'0');
	  	}

		return (
			<div className="timer-row">
				<button className="timer-button" onClick={() => { 
					this.resetTimer(); 
					this.props.newGame();
					this.startTimer();
				}}>New Game</button>
				<span className="timer">{displayTime}</span>	
				<button className="timer-button" onClick={this.props.toggleTimer}>{button}</button>
			</div>
		);
	}
}