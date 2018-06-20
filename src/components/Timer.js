import React from 'react';
import '../index.css';

export default class Timer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			count: Number(sessionStorage.getItem('timer')) || 0,
		}
	}

	tick = () => {
		sessionStorage.setItem('timer', this.state.count + 1);
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
		if (this.props.gameID !== nextProps.gameID) {
			console.log("New game detected in Will Receive Props");
			console.log(this.props.gameID,nextProps.gameID);
			this.resetTimer();
			if (nextProps.running) {
				this.startTimer();
			}
		}
		else if (this.props.running !== nextProps.running) {
			console.log("Component Will Receive Props - toggling timer");
			if (nextProps.running) {
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
		const button = this.props.running ? 'Pause' : 'Resume';

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
					this.props.startNewGame();
					this.startTimer();
				}}>New Game</button>
				<span className="timer">{displayTime}</span>	
				<button className="timer-button" onClick={() => {
					this.props.running ? this.stopTimer() : this.startTimer();
					this.props.toggleTimer();
				}}>{button}</button>
			</div>
		);
	}
}