import React, { useState, useEffect } from 'react';
import './HomePage.css';
import logo from '../Assets/logo.png';
import click from '../Assets/click.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import ParameterList from '../Components/ParameterList';
import YoutubeVideo from '../Components/YoutubeVideo';
import qrimg1 from '../Assets/qr-img-40.jpeg';
import qrimg2 from '../Assets/qr-img-99.jpeg';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomePage = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentOption, setPaymentOption] = useState('');
  const [amountOption, setAmountOption] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [isLoading, setIsLoading] = useState(false);

  const handleInstantReportClick = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentOptionClick = (option) => {
    setPaymentOption(option);
    setAmountOption(null); // Reset the amount selection
  };

  const handleAmountOptionClick = (amount) => {
    setAmountOption(amount);
  };

  const handleConfirmPayment = () => {
    const payload = {
      amount: amountOption,
      name: 'Dhanush',
      mobile: 1234567890,
      paymentMethod: paymentOption,
    };

    setIsLoading(true);

    // Check if online
    if (navigator.onLine) {
      // Proceed with online payment
      processPayment(payload);
    } else {
      // Store payment data in localStorage
      localStorage.setItem('offlinePayment', JSON.stringify(payload));
      setIsLoading(false);
      toast.warning('You are offline. Payment will be processed once you are online.');
      setPaymentStatus('success'); // Set to success for the user feedback
    }
  };

  // Function to process payment
  const processPayment = (payload) => {
    fetch('https://kiosk-q5q4.onrender.com/user-reciept/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to process payment. Please try again.');
        }
        return response.json();
      })
      .then((data) => {
        setIsLoading(false);
        setPaymentStatus('success');
        toast.success('Payment successful!');
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error('Payment failed. Please try again.');
        setPaymentStatus('failed');
      });
  };

  useEffect(() => {
    const syncOfflinePayments = () => {
      const offlinePayment = localStorage.getItem('offlinePayment');
      if (offlinePayment) {
        const paymentData = JSON.parse(offlinePayment);
        processPayment(paymentData);
        localStorage.removeItem('offlinePayment'); // Clear offline data after syncing
      }
    };

    window.addEventListener('online', syncOfflinePayments);

    return () => {
      window.removeEventListener('online', syncOfflinePayments);
    };
  }, []);

  // Redirect to the Android app if payment is successful
  useEffect(() => {
    if (paymentStatus === 'success') {
      const redirectToAndroidApp = () => {
        window.location.href = 'intent://launch/#Intent;scheme=https;package=com.burra.cowinemployees;end';
      };

      setTimeout(() => {
        redirectToAndroidApp();
      }, 3000); // Redirect after 3 seconds
    }
  }, [paymentStatus]);

  // Ensure the modal only closes when payment status is 'success'
  const closeModal = () => {
    setShowPaymentModal(false);
    setPaymentOption('');
    setAmountOption(null);
    setPaymentStatus('pending'); // Reset payment status when closing the modal
  };

  return (
    <div className="homepage-container">
      <div className="header-container">
        <div className="image-container">
          <img src={logo} alt="Atmaprikash Logo" className="logo" />
        </div>
        <h1 className="title">Health ATM (Vitals Checking Machine)</h1>
      </div>
      <p className="subtitle">Check Your Vitals, Instant Report</p>

      <div className="instant-report-section">
        <button className="instant-report-button" onClick={handleInstantReportClick}>
          Check Your Vitals
          <img src={click} alt="" style={{ width: "50px", borderRadius: '50px' }} />
        </button>
      </div>

      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>

            {paymentStatus === 'pending' && (
              <>
                {!paymentOption ? (
                  <>
                    <h1>Select Payment Option</h1>
                    <div className="payment-options">
                      <button onClick={() => handlePaymentOptionClick('QR')}>QR Code</button>
                      <button onClick={() => handlePaymentOptionClick('Cash')}>Cash</button>
                    </div>
                  </>
                ) : null}

                {paymentOption && !amountOption && (
                  <>
                    <h2>Select Amount</h2>
                    <div className="amount-options">
                      <button onClick={() => handleAmountOptionClick(40)}>&#8377; 40/-</button>
                      <button onClick={() => handleAmountOptionClick(99)}>&#8377; 99/-</button>
                    </div>
                  </>
                )}

                {amountOption && paymentOption === 'QR' && (
                  <>
                    <h3>Scan the QR Code for {amountOption}/-</h3>
                    {amountOption === 40 && <img src={qrimg1} alt="QR Code for 40 INR" className="qr-code-image" />}
                    {amountOption === 99 && <img src={qrimg2} alt="QR Code for 99 INR" className="qr-code-image" />}
                    <button className="confirm-payment-button" onClick={handleConfirmPayment} disabled={isLoading}>
                      {isLoading ? 'Processing...' : 'Confirm Payment'}
                    </button>
                  </>
                )}

                {amountOption && paymentOption === 'Cash' && (
                  <>
                    <h3>You have selected to pay {amountOption}/- by Cash</h3>
                    <button className="confirm-payment-button" onClick={handleConfirmPayment} disabled={isLoading}>
                      {isLoading ? 'Processing...' : 'Confirm Payment'}
                    </button>
                  </>
                )}
              </>
            )}

            {paymentStatus === 'success' && (
              <div className="success-modal">
                <h1>Payment Successful!</h1>
                <FontAwesomeIcon icon={faCircleCheck} size="6x" style={{ color: "#218838" }} />
              </div>
            )}
          </div>
        </div>
      )}

      <ParameterList />
      <YoutubeVideo />
    </div>
  );
};

export default HomePage;
