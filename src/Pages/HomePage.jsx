import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import './HomePage.css';
import logo from '../Assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleRight, faCircleXmark, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const HomePage = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [upiLink, setUpiLink] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending', 'success', 'failure'
  const [intervalId, setIntervalId] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  const clearPaymentCheck = () => {
    if (intervalId) clearInterval(intervalId);
    if (timeoutId) clearTimeout(timeoutId);
    setIntervalId(null);
    setTimeoutId(null);
  };

  useEffect(() => {
    if (transactionId && showPaymentModal) {
      const newIntervalId = setInterval(() => checkPaymentSuccess(transactionId), 3000);
      const newTimeoutId = setTimeout(() => {
        if (paymentStatus !== 'success') {
          setPaymentStatus('failure');
          clearPaymentCheck();
        }
      }, 180000); // 3 minutes timeout

      setIntervalId(newIntervalId);
      setTimeoutId(newTimeoutId);
    } else {
      clearPaymentCheck();
    }

    return () => clearPaymentCheck();
  }, [transactionId, showPaymentModal]);

  const generateOrderId = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  };

  const checkPaymentSuccess = async (transactionId) => {
    try {
      const response = await axios.get(`https://kiosk-q5q4.onrender.com/payment-gateway/paymentStatus/${transactionId}`);
      if (response.data.data === true) {
        setPaymentStatus('success');
        clearPaymentCheck();
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setPaymentStatus('failure');
      clearPaymentCheck();
    }
  };

  const handleInstantReportClick = async (e) => {
    e.preventDefault();
    setShowPaymentModal(true);
    const orderId = generateOrderId();
    try {
      const token = '367|qM5tv66Rhk8Tm13DlvDkc92KNwVMvAhOuljLB8tA';
      const transactionData = {
        amount: '1',
        description: 'Health ATM Report',
        name: 'Gopi',
        email: 'dhanushnm07@gmail.com',
        mobile: Number('1234567890'),
        enabledModesOfPayment: 'upi',
        payment_method: 'UPI_INTENT',
        source: 'api',
        order_id: orderId,
        user_uuid: 'swp_sm_903dd099-3a9e-4243-ac1e-f83f83c30725',
        other_info: 'api',
        encrypt_response: 0
      };

      const formData2 = new FormData();
      for (const key in transactionData) {
        formData2.append(key, transactionData[key]);
      }

      const transactionResponse = await axios.post('https://www.switchpay.in/api/createTransaction', formData2, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const { upi_intent_link, transaction_id } = transactionResponse.data;
      setUpiLink(upi_intent_link);
      setTransactionId(transaction_id);

    } catch (error) {
      console.error('Error submitting form:', error.response ? error.response.data : error.message);
      setPaymentStatus('failure'); // Set payment status to failure on error
      clearPaymentCheck();
    }
  };

  const redirectToAndroidApp = () => {
    window.location.href = 'intent://launch/#Intent;package=com.example.cowinbmi;end'; // Replace with the actual package name
  };

  const closeModal = () => {
    setShowPaymentModal(false);
    setPaymentStatus('pending'); // Reset payment status when closing the modal
    clearPaymentCheck();
  };

  useEffect(() => {
    if (paymentStatus === 'success') {
      setTimeout(() => {
        redirectToAndroidApp();
      }, 2000); // Redirect after showing success modal for 2 seconds
    } else if (paymentStatus === 'failure') {
      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentStatus('pending');
      }, 120000); // Close modal after showing failure modal for 2 seconds
    }
  }, [paymentStatus]);

  return (
    <div className="homepage-container">
      {/* Logo */}
      <div className="image-container">
        <img src={logo} alt="Atmaprikash Logo" className="logo" />
      </div>

      {/* Title */}
      <h1 className="title">Health ATM (Vitals Checking Machine)</h1>

      {/* Subheading */}
      <p className="subtitle">Check Your Vitals, Instant Report</p>

      <div className="instant-report-section">
        <button className="instant-report-button" onClick={handleInstantReportClick}>
          Check Your Vitals <FontAwesomeIcon icon={faCircleRight} shake size="2xl" style={{ color: "#FFD43B" }} />
        </button>
      </div>

      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            {paymentStatus === 'pending' && (
              <>
                <span className="close" onClick={closeModal}>&times;</span>
                <h1 style={{color: "#007BFF"}}>Pay 99/- INR to Proceed</h1>
                <QRCode value={upiLink} size={328} />
                <div className="button-container">
                </div>
              </>
            )}
            {paymentStatus === 'success' && (
              <div className="success-modal">
                <span className="close" onClick={closeModal}>&times;</span>
                <h1>Payment Successful!</h1>
                <FontAwesomeIcon icon={faCircleCheck} size="6x" style={{ color: "#0ff05e", }} />
              </div>
            )}
            {paymentStatus === 'failure' && (
              <div className="failure-modal">
                <span className="close" onClick={closeModal}>&times;</span>
                <h1>Payment Failed, Please Try Again</h1>
                <FontAwesomeIcon icon={faCircleXmark} size="6x" style={{ color: "#e00b2b", }} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image and Parameters List */}
      <div className="image-parameters-section">
        <div className="parameters-section">
          <ul className="parameters-list left-list">
            <li><i className="fas fa-user"></i> Age / ವಯಸ್ಸು</li>
            <li><i className="fas fa-ruler-vertical"></i> Height / ಎತ್ತರ</li>
            <li><i className="fas fa-weight"></i> Weight / ತೂಕ</li>
            <li><i className="fas fa-calculator"></i> Body Mass Index / ದೇಹದ ಮಾಪಕ</li>
            <li><i className="fas fa-apple-alt"></i> Nutritional Status / ಪೋಷಕ ಸ್ಥಿತಿ</li>
            <li><i className="fas fa-weight-hanging"></i> Ideal Body Weight / ಆದರ್ಶ ದೇಹದ ತೂಕ</li>
            <li><i className="fas fa-percentage"></i> Body Fat / ದೇಹದ ಕೊಬ್ಬು</li>
          </ul>
          <ul className="parameters-list right-list">
            <li><i className="fas fa-water"></i> Total Body Water / ಒಟ್ಟು ದೇಹದ ನೀರು</li>
            <li><i className="fas fa-burn"></i> Basal Metabolic Rate / ಮೂಲವ್ಯೂಪಚಯ ದರ</li>
            <li><i className="fas fa-weight"></i> Fat Mass / ಕೊಬ್ಬಿನ ಪ್ರಮಾಣ</li>
            <li><i className="fas fa-dumbbell"></i> Lean/Skeletal Body Mass / ಕುಳಿತ ದೇಹದ ಪ್ರಮಾಣ</li>
            <li><i className="fas fa-exclamation-circle"></i> Overweight By / ಅಧಿಕ ತೂಕದ ಮೂಲಕ</li>
            <li><i className="fas fa-clipboard-check"></i> Recommendations / ಶಿಫಾರಸುಗಳು</li>
            <li><i className="fas fa-star"></i> Your Lucky Message / ನಿಮ್ಮ ಭಾಗ್ಯದ ಸಂದೇಶ</li>
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
