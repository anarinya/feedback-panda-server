import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Checkout } from '../billing';

class Header extends Component {
  renderContent() {
    const { auth } = this.props;
    const { credits } = auth || 0;

    switch (auth) {
      case false:
        // Not logged in
        return <li><a href="/auth/google">Login with Google</a></li>;
      case null:
        // Unknown authentication state
        return;
      default:
        // Logged in
        return [
          <li key="1"><Checkout /></li>,
          <li className="credits" key="2">Credits: { credits }</li>,
          <li key="3"><a href="/api/logout">Logout</a></li>
        ];
    }
  }

  render() {
    const { auth } = this.props;
    return (
      <div className="Header">
        <nav>
          <div className="nav-wrapper cyan lighten-2">
            <Link className="left" to={ auth ? '/surveys' : '/' }>
              <span className="logo"></span>
            </Link>
            <ul id="nav-mobile" className="right">
              { this.renderContent() }
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => ({ auth });

export default connect(mapStateToProps)(Header);