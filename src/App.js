import React, { Component } from 'react';
//var ReactDOM = require('react-dom');
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class App extends Component {

  constructor(props) {
    super(props);

		// set initial state
		this.state = {
			isModalOpen: false,
      isInnerModalOpen: false,
      response: [],
      users: [],
      user: [],
      startDate: new Date(),
      activity_periods: [],
      userId: "",
      userName: "",
      isCalenderOpen: false,
		};
		// bind functions
		this.closeModal = this.closeModal.bind(this);
		this.openModal = this.openModal.bind(this);
  }

   handleChange = date => {
    this.setState({
      startDate: date
    });
  };


	// close modal (set isModalOpen, true)
	closeModal() {
		this.setState({
			isModalOpen: false
		});
	}

	// open modal (set isModalOpen, false)
	openModal(userData) {
   //alert(userData.activity_periods[0].start_time)
		this.setState({
      isModalOpen: true,
      user:userData,
      activity_periods: userData.activity_periods,
      userId: userData.id,
      userName: userData.real_name
    });
  }
  
  componentDidMount() {
    fetch('http://localhost:9000/api/users/')
    .then(res => res.json())
    .then((data) => {
      this.setState({ response: data })
      this.setState({ users: data.members })
      console.log('full response===>')
      console.log(this.state.response)
      console.log('abstract users data only===>')
      console.log(this.state.users)
    })
    .catch(console.log)
  }
  render() {
    return (
      <div className="container">
      <div className="col-xs-12">
      <h1 style={{textAlign: "center", color: "green", marginTop: 40}}>All Users</h1>
      {this.state.users.map((user) => (
        <div className="card" key={user.id} onClick={() => this.openModal(user)}>
          <div className="card-body">
            <h5 className="card-title">Name: {user.real_name}</h5>
            <h6 className="card-subtitle mb-2 text-muted">Id: {user.id}</h6>
          </div>
        </div>
      ))}

      <Modal
        isModalOpen={this.state.isModalOpen}
        closeModal={this.closeModal}
        style={modalStyle}
      >

        <button
          style={{
            ...mainStyle.button,
            margin: 0,
            width: "auto",
            marginTop: 10,
            float: "right"
          }}
          onClick={this.closeModal}
        >
          Close 
        </button>

        <button
          style={{
            ...mainStyle.button,
            margin: 0,
            width: "auto",
            marginTop: 10,
            float: "left",
          }}
        >
          Check By Date 
        </button>

      <div style={{marginTop:70, marginBottom: 15}}>
        <DatePicker
          selected={this.state.startDate}
          onChange={this.handleChange}
        />
      </div>
      
      {this.state.activity_periods.map((activity) => (
        <Activity  calData={this.state.startDate} activityData={activity} userId={this.state.userId} userName={this.state.userName} />
      ))}
        
      </Modal>

      </div>
     </div>
    );
  }
}


class Activity extends React.Component {
  constructor(props) {
		super(props);
      this.state = {
        month: "",
        date: "",
        year: '',
        monthNames:["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      }
    }
  
	render() {
    this.month=this.props.activityData.start_time.split(" ")[0]
    this.date=this.props.activityData.start_time.split(" ")[1]
    this.year=this.props.activityData.start_time.split(" ")[2]
  
    if((this.state.monthNames[this.props.calData.getMonth()]===this.month) && (this.props.calData.getFullYear()== this.year)
      && (this.props.calData.getDate()== this.date)
      ){
      return (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{this.props.userName}
              <span style={{color: "green"}}> Online On </span>
              <span>{this.props.calData.getDate()} {this.state.monthNames[this.props.calData.getMonth()]} {this.props.calData.getFullYear()}</span>
            </h5>
            <h5 className="card-title">From: {this.props.activityData.start_time.split(" ")[4]}</h5>
            <h5 className="card-title">To: {this.props.activityData.end_time.split(" ")[3]}</h5>
          </div>
        </div>
      );
    } else{
      return (
        <div className="card" style={{display: "none"}}>
          <div className="card-body">
            <h5 className="card-title">{this.props.userName}
              <span style={{color: "Red"}}> Offline </span>
              <span>
              {this.props.calData.getDate()} {this.state.monthNames[this.props.calData.getMonth()]} {this.props.calData.getFullYear()}  
              </span>
            </h5>
          </div>
        </div>
      );
    }
	}
}



class Modal extends React.Component {

	constructor(props) {
		super(props);

		this.outerStyle = {
			position: "fixed",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			overflow: "auto",
			zIndex: 1
		};

		// default style
		this.style = {
			modal: {
				position: "relative",
				width: 500,
				padding: 20,
				boxSizing: "border-box",
				backgroundColor: "#fff",
				margin: "40px auto",
				borderRadius: 3,
				zIndex: 2,
				textAlign: "left",
				boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
				...this.props.style.modal
			},
			overlay: {
				position: "fixed",
				top: 0,
				bottom: 0,
				left: 0,
				right: 0,
				width: "100%",
				height: "100%",
				backgroundColor: "rgba(0,0,0,0.5)",
				...this.props.style.overlay
			}
		};
	}

	// render modal
	render() {
		return (
			<div
				style={{
					...this.outerStyle,
					display: this.props.isModalOpen ? "block" : "none"
				}}
			>
				<div style={this.style.overlay} onClick={this.props.closeModal} />
				<div onClick={this.props.closeModal} />
				<div style={this.style.modal}>{this.props.children}</div>
			</div>
		);
	}
}

// overwrite style
const modalStyle = {
	overlay: {
		backgroundColor: "rgba(0, 0, 0,0.5)"
	}
};

const mainStyle = {
	app: {
		margin: "120px 0"
	},
	button: {
		backgroundColor: "#408cec",
		border: 0,
		padding: "12px 20px",
		color: "#fff",
		margin: "0 auto",
		width: 150,
		display: "block",
		borderRadius: 3
	}
};
export default App;