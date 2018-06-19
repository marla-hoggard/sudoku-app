import React from 'react';
import '../index.css';

export default class Timer extends React.Component {
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
		//console.log("Component Will Receive Props");
		if (this.props.activeGame !== nextProps.activeGame) {
			console.log("Component Will Receive Props");
			if (nextProps.activeGame) {
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
		const button = this.props.activeGame ? 'Pause' : 'Resume';

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
				<button className="timer-button" onClick={() => {
					this.props.activeGame ? this.stopTimer() : this.startTimer();
					this.props.toggleActiveGame();
				}}>{button}</button>
			</div>
		);
	}
}