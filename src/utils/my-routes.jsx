import React from "react";
import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from "react-router-dom";
import Home from "../Pages/Home";
import Sign from "../App/pages/Login";
import Channel from "../App/pages/DirectMessage";
import Server from "../App/pages/Server";
import MainPage from "../App/pages/MainPage";
import Loader from "./Loader";
import NotFound from "./NotFound";
import PasswordReset from "./security/passwordReset";
import Support from "../Pages/support";
import firebase from "firebase/compat/app";

export default function MyRoutes(props) {
	return (
		<Router>
			<AuthenticatedRoutes
				isAuthenticated={props.isAuthenticated}
				strPwdTest={props.strPwdTest}
			/>
		</Router>
	);
}

class AuthenticatedRoutes extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			isAuthenticated: false,
		};
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			this.setState({ isAuthenticated: !!user, loading: false });
		});
	}

	render() {
		return (
			<Routes>
				{this.state.loading ? (
					<Route path="*" element={<Loader />} />
				) : (
					<>
						<Route path="/" element={<Home />} />
						<Route
							path="sign-in"
							element={
								!this.props.isAuthenticated ? (
									<Sign pwdTestReg={this.props.strPwdTest} />
								) : (
									<Navigate to="/app" replace />
								)
							}
						/>
						<Route
							path="app"
							element={
								this.props.isAuthenticated ? (
									<MainPage />
								) : (
									<Navigate to="/sign-in" replace />
								)
							}
						/>
						<Route path="support" element={<Support />} />
						<Route
							path="app/channel/:channelId"
							element={
								this.props.isAuthenticated ? (
									<Channel />
								) : (
									<Navigate to="/sign-in" replace />
								)
							}
						/>
						<Route
							path="app/channel/server/:serverId/:channelId?"
							element={
								this.props.isAuthenticated ? (
									<Server />
								) : (
									<Navigate to="/sign-in" replace />
								)
							}
						/>
						<Route
							path="reset"
							element={<PasswordReset pwdTestReg={this.props.strPwdTest} />}
						/>
						<Route path="*" element={<NotFound />} />
					</>
				)}
			</Routes>
		);
	}
}
