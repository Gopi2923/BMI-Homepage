import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import './HomePage.css';
import logo from '../Assets/logo.png';
import healthImage from '../Assets/backgroundimg01.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleRight } from '@fortawesome/free-solid-svg-icons';


const HomePage = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const handleInstantReportClick = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentConfirmation = () => {
    setPaymentConfirmed(true);
    redirectToAndroidApp();
  };

  const redirectToAndroidApp = () => {
    window.location.href = 'intent://launch/#Intent;package=com.example.cowinbmi;end'; // Replace with the actual package name
  };

  const closeModal = () => {
    setShowPaymentModal(false);
  };

  return (
    <div className="homepage-container">
      {/* Logo */}
      <img src={logo} alt="Atmaprikash Logo" className="logo" />

      {/* Title */}
      <h1 className="title">Health ATM (Vitals Checking Machine)</h1>

      {/* Subheading */}
      <p className="subtitle">Check Your Vitals, Instant Report</p>

      <div className="instant-report-section">
        <button className="instant-report-button" onClick={handleInstantReportClick}>
          Check Your Vitals <FontAwesomeIcon icon={faCircleRight} fade size="2xl" style={{color: "#B197FC",}} />
        </button>
      </div>

      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Pay 99 INR to Proceed</h2>
            <QRCode value="http://example.com/payment" size={328} />
            <button className="confirm-payment-button" onClick={handlePaymentConfirmation}>
              Confirm Payment
            </button>
            <button className="close-modal-button" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {paymentConfirmed && (
        <div className="redirecting-section">
          {/* <p>Redirecting to the CoWin BMI app...</p> */}
        </div>
      )}

      {/* Image and Parameters List */}
      <div className="image-parameters-section">
        {/* <img src={healthImage} alt="Health Check" className="health-image" /> */}

        <div className="parameters-section">
          <ul className="parameters-list left-list">
            <li><i className="fas fa-user"></i> Age</li>
            <li><i className="fas fa-ruler-vertical"></i> Height</li>
            <li><i className="fas fa-weight"></i> Weight</li>
            <li><i className="fas fa-calculator"></i> Body Mass Index</li>
            <li><i className="fas fa-apple-alt"></i> Nutritional Status</li>
            <li><i className="fas fa-weight-hanging"></i> Ideal Body Weight</li>
            <li><i className="fas fa-percentage"></i> Body Fat</li>
          </ul>
          <ul className="parameters-list right-list">
            <li><i className="fas fa-water"></i> Total Body Water</li>
            <li><i className="fas fa-burn"></i> Basal Metabolic Rate</li>
            <li><i className="fas fa-weight"></i> Fat Mass</li>
            <li><i className="fas fa-dumbbell"></i> Lean/Skeletal Body Mass</li>
            <li><i className="fas fa-exclamation-circle"></i> Overweight By</li>
            <li><i className="fas fa-clipboard-check"></i> Recommendations</li>
            <li><i className="fas fa-star"></i> Your Lucky Message</li>
          </ul>
        </div>
      </div>

      {/* Video Section */}
      <div className="video-section">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/Erhv6vECfPU?autoplay=1&loop=1&playlist=Erhv6vECfPU"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="video"
        ></iframe>
      </div>
    </div>
  );
};

export default HomePage;
