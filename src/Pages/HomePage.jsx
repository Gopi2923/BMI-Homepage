import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import './HomePage.css';
import logo from '../Assets/logo.png';

const HomePage = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const handleInstantReportClick = () => {
    setShowPayment(true);
  };

  const handlePaymentConfirmation = () => {
    setPaymentConfirmed(true);
    redirectToAndroidApp();
  };

  const redirectToAndroidApp = () => {
    window.location.href = 'intent://launch/#Intent;package=com.example.cowinbmi;end'; // Replace with the actual package name
  };

  return (
    <div className="homepage-container">
      {/* Logo */}
      <img src={logo} alt="Atmaprikash Logo" className="logo" />

      {/* Title */}
      <h1 className="title">Health ATM (Vitals Checking Machine)</h1>

      {/* Subheading */}
      <p className="subtitle">Check Your Vitals, Instant Report</p>

      {!showPayment && (
        <div className="instant-report-section">
          <button className="instant-report-button" onClick={handleInstantReportClick}>
            Get Instant Report
          </button>
        </div>
      )}

      {showPayment && !paymentConfirmed && (
        <div className="payment-section">
          <h2>Pay 99 INR to Proceed</h2>
          <QRCode value="http://example.com/payment" size={128} />
          <button className="confirm-payment-button" onClick={handlePaymentConfirmation}>
            Confirm Payment
          </button>
        </div>
      )}

      {paymentConfirmed && (
        <div className="redirecting-section">
          <p>Redirecting to the CoWin BMI app...</p>
        </div>
      )}

      {/* Parameters List */}
      <div className="parameters-section">
        <ul className="parameters-list left-list">
          <li>Age</li>
          <li>Height</li>
          <li>Weight</li>
          <li>Body Mass Index</li>
          <li>Nutritional Status</li>
          <li>Ideal Body Weight</li>
          <li>Body Fat</li>
        </ul>
        <ul className="parameters-list right-list">
          <li>Total Body Water</li>
          <li>Basal Metabolic Rate</li>
          <li>Fat Mass</li>
          <li>Lean/Skeletal Body Mass</li>
          <li>Overweight By</li>
          <li>Recommendations</li>
          <li>Your Lucky Message</li>
        </ul>
      </div>

      {/* Video Section */}
      <div className="video-section">
        <video src="/vitals-video.mp4" autoPlay loop muted className="video"></video>
      </div>
    </div>
  );
};

export default HomePage;
