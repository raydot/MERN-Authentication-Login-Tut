import React, { Component } from "react"
import { Link, withRouter } from "react-router-dom"

// See the bottom of the code for explanations on the use of most of these
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { registerUser } from "../../actions/authActions"
import classnames from "classnames"

class Register extends Component {
	constructor() {
		super();
		this.state = {
			name: "",
			email: "",
			password: "",
			password2: "",
			errors: {}
		};
	}//constructor

	componentWillReceiveProps(nextProps) {
		if (nextProps.errors) {
			this.setState({
				errors: nextProps.errors
			});
		}
	}

	onChange = e => {
		this.setState({ [e.target.id]: e.target.value })
	} //onChange


	onSubmit = e => {
		//keep the page from reloading
		e.preventDefault()
	

		const newUser = {
			name: this.state.name,
			email: this.state.email,
			password: this.state.password,
			password2: this.state.password2
		};

		console.log(newUser);
		this.props.registerUser(newUser, this.props.history);
	} // onSubmit

	render() {
		const { errors } = this.state
		// or const errors = this.state.errors

		return(
			<div className="container">
				<div className="row">
					<div className="col s8 offset-2">
						<Link to="/" className="btn-flat waves-effect">
							<i className="material-icons left">keyboard_backspace</i> Back to home
						</Link>
						<div className="col s12" style={{ paddingLeft:"11.250px" }}>
							<h4>
								<b>Register</b> below
							</h4>
							<p className="grey-text text-darken-1">
								Already have an account? <Link to="/login">Log in</Link>
							</p>
						</div>
						<form noValidate onSubmit={this.onSubmit}>
							<div className="input-field col s12">
								<input
									onChange={this.onChange}
									value={this.state.name}
									error={errors.name}
									id="name"
									type="text"
									className={classnames("", {
										invalid: errors.name
									})}
								/>
								<label htmlFor="name">Name</label>
								<span className="red-text">{errors.name}</span>
							</div>
							<div className="input-field col s12">
								<input
									onChange={this.onChange}
									value={this.state.email}
									error={errors.email}
									id="email"
									type="email"
								/>
								<label htmlFor="name">Email</label>
								<span className="red-text">{errors.email}</span>
							</div>
							<div className="input-field col s12">
								<input
									onChange={this.onChange}
									value={this.state.password}
									error={errors.password}
									id="password"
									type="password"
									className={classnames("", {
										invalid: errors.password
									})}
								/> 
								<label htmlFor="password">Password</label>
								<span className="red-text">{errors.password}</span>
							</div>
							<div className="input-field col s12">
								<input
									onChange={this.onChange}
									value={this.state.password2}
									error={errors.password2}
									id="password2"
									type="password"
									className={classnames("", {
										invalid: errors.password2
									})}
								/>
								<label htmlFor="password2">Confirm Password</label>
								<span className="red-text">{errors.password2}</span>
							</div>
							<div className="col s12" style={{ paddingLeft: "11.250px"}}>
								<button
									style={{
										width: "150px",
										borderRadius: "3px",
										letterSpacing: "1.5px",
										marginTop: "1rem"
									}}
									type="submit"
									className="btn btn-large waves-effect waves-light hoverable blue accent-3"
								>
								Sign Up
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		);					

	}//render()
}//class Register

// define prop types
// Since we cannot define types in our constructor, it is considered good convention to do so using the prop-types package
Register.propTypes = {
	registerUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
}

// mapStateToProps allows us to get our state from Redux and map it to props which we can use inside components
// this allows us to call this.props.auth or this.props.errors within our Register component
const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});


/*	We can't redirect with an action by default from within a component. This construction:
	* 	Uses withRouter from react-router-dom to wrap our component in our withRouter export
	*	Will add a parameter to this.props.history within our call to this.props.registerUser(newUser, this.props.history). in our onSubmit event so we can easily access it within our action
*/ 
export default connect(
	mapStateToProps, { registerUser }
)(withRouter(Register));